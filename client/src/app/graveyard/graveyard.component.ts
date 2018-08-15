import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { User } from '../classes/user';
import { DataService } from '../services/data.service';
import { AppGlobals } from '../app.globals';
import { debug } from 'util';
import { _iterableDiffersFactory } from '@angular/core/src/application_module';

export interface UserOptions {
  limit: number;
};

@Component({
  selector: 'app-graveyard',
  templateUrl: './graveyard.component.html'
})
export class GraveyardComponent implements OnInit {
  graves: User[] = [];
  comments: any[] = [];
  objects: any[] = [];
  grave: User = null;
  position: number = 0;
  skyImage: string = null;
  graveUserImage: string = null;
  graveyardImage: string = null;
  selectedGraveDetailTab: string = null;
  graveyardStartPosition: number = null;
  isRainfallScene:boolean = false;
  isSnowfallScene:boolean = false;
  isGraveDetailsOpen:boolean = false;
  isThunderstromScene:boolean = false;
  isGraveyardLoading:boolean = true;
  isRemeberanceFormOpen:boolean = false;
  condolenceMessage:string = null;
  condolenceSignature:string = null;
  selectedGraveId:number = 0;
  router:Router = null;
  totalGraves: number = 0;
  graveSize: number = 512;
  options: UserOptions = {
    limit: 10
  };

  constructor(private route: ActivatedRoute, private dataService: DataService, private _global: AppGlobals, private _router: Router) { 
    this.router = _router;
  }

  ngOnInit() {
    let position = +this.route.snapshot.paramMap.get('position');
    let scene = this.route.snapshot.paramMap.get('scene');
    let season = scene.split('_')[1];
    if(Number(season) == 2 || Number(season) == 3){
      this.isRainfallScene = true;
    }
    if(Number(season) == 4){
      this.isSnowfallScene = true;
    }
    if(Number(season) == 3){
      this.isThunderstromScene = true;
    }
    this.skyImage = 'url(./assets/images/sky/'+this._global.getSkyImage(scene)+')';
    this.graveyardImage = 'url(./assets/images/graveyard-backgrounds/'+this._global.getGraveyardImage(scene)+')';
    this.options = this._global.refreshObject(this.options, ['limit=10', 'position='+position, 'order=user_id']);
    this.dataService.getAllWithMethodAndOptions('GRAVES', this._global.serializeAndURIEncode(this.options))
      .subscribe(graves => {
        this.graves = graves.reverse();
        this.totalGraves = graves.length;
        this.graveyardStartPosition = ((this.totalGraves - 2) * this.graveSize );
        for(let i=0; i<=graves.length-1;i++){
          //graves[i].graveUrl = 'url(./assets/images/graves/grob'+graves[i].grave_id+'_'+graves[i].grave_image+'.png)';
          graves[i].graveUrl = 'url(./assets/images/graves/grob1_'+graves[i].grave_image+'.png)';
        }
        this.isGraveyardLoading = false;
      });
    this.selectedGraveDetailTab = 'tab1';


    let context = this;
    window.addEventListener("load",function(){
      document.querySelector('#content.loading-bg').addEventListener("mousemove", context.mouseMove);
      document.querySelector('#content.loading-bg').addEventListener("mouseup", context.mouseUp);
      document.querySelector('#content.loading-bg').addEventListener("mousedown", context.mouseDown); 
    });
  }

  backToSearchResults(){
    this.router.navigateByUrl('/noticeboard');
  }

  nextGrave(){
    if(this.graveyardStartPosition >= this.graveSize)
      this.graveyardStartPosition -= this.graveSize;
  }

  previousGrave(){
    if(this.graveyardStartPosition == ((this.totalGraves - 2) * this.graveSize ))
      return;

    this.graveyardStartPosition += this.graveSize;
  }

  getGraves(param: string): void {
    
  }
  showGraveDetails(grave:any): void{
    this.selectedGraveId = grave.user_id;
    this.isGraveDetailsOpen = true;
    this.selectedGraveDetailTab = 'tab1';
    
    this.grave = null;
    this.graveUserImage = null;
    this.options = this._global.refreshObject(this.options, ['limit=10', 'position=0', 'user_id='+grave.user_id]);
    this.dataService.getAllWithMethodAndOptions('GRAVE_DETAILS', this._global.serializeAndURIEncode(this.options))
      .subscribe(graves => {
        this.grave = graves[0];
      }
    );
    
    this.options = this._global.refreshObject(this.options, ['user_id='+grave.user_id]);
    this.dataService.getAllWithMethodAndOptions('GRAVE_COMMENTS', this._global.serializeAndURIEncode(this.options))
      .subscribe(data => {
        this.comments = data;
      }
    );

    this.options = this._global.refreshObject(this.options, ['user_id='+grave.user_id]);
    this.dataService.getAllWithMethodAndOptions('GRAVE_USER_PHOTO', this._global.serializeAndURIEncode(this.options))
      .subscribe(data => {
        this.graveUserImage = './assets/images/zdjecia/large/'+data[0].file_name;
      }
    );

    this.options = this._global.refreshObject(this.options, ['object_name=znicz', 'user_id='+grave.user_id]);
    this.dataService.getAllWithMethodAndOptions('GRAVE_CANDLES', this._global.serializeAndURIEncode(this.options))
      .subscribe(data => {
        this.objects = data;
        for(var i=0; i<=this.objects.length-1; i++){
          if(this.objects[i].object_name == 'kwiat'){
            this.objects[i]['object_url'] = './assets/images/znicze/kwiat'+this.objects[i].object_id+'.png';
          }
          else if(this.objects[i].object_name == 'inne'){
            this.objects[i]['object_url'] = './assets/images/znicze/inne'+this.objects[i].object_id+'.png';
          }
          else if(this.objects[i].object_name == 'kamien'){
            this.objects[i]['object_url'] = './assets/images/znicze/kamien'+this.objects[i].object_id+'.png';
          }
          else if(this.objects[i].object_name == 'znicz'){
            this.objects[i]['object_url'] = './assets/images/znicze/znicz'+this.objects[i].object_id+'.gif';
          }
        }
      }
    );
  }
  closeDetails(): void{
    this.isGraveDetailsOpen = false;
  }
  openTab(tabName:string):void{
    this.selectedGraveDetailTab = tabName;
  }
  openRememberanceForm(){
    this.isRemeberanceFormOpen = true;
  }
  closeRememberanceForm(){
    this.isRemeberanceFormOpen = false;
  }
  addCondolence(){
    this.options = this._global.refreshObject(this.options, ['nick='+this.condolenceSignature, 
    'body='+this.condolenceMessage, 'user_id='+this.selectedGraveId, 'method=COMMENT']);
    this.dataService.createWithMethodAndOptions(this.options)
      .subscribe(result => {
        this.options = this._global.refreshObject(this.options, ['user_id='+this.selectedGraveId]);
        this.dataService.getAllWithMethodAndOptions('GRAVE_COMMENTS', this._global.serializeAndURIEncode(this.options))
          .subscribe(comments => {
            this.comments = comments;
            this.isRemeberanceFormOpen = false;
          }
        );
      });
  }
  mouseUp = (event: MouseEvent) => {
    this.moveLogo(event);
  }
  mouseDown = (event: MouseEvent) => {
    this.moveLogo(event);
  }
  mouseMove = (event: MouseEvent) => {
    this.moveLogo(event);
  }
  moveLogo(event:MouseEvent){
    var image = document.getElementById('logo-gif');
    image.style.position = 'absolute';
    image.style.top = event.clientY + 'px';
    image.style.left = event.clientX + 'px';
  }
}