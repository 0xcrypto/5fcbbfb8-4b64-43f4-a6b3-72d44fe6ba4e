import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { DataService } from '../services/data.service';
import { MessageService } from '../services/message.service';
import { ImageService } from '../services/image.service';
import { AppGlobals } from '../app.globals';
import { debug } from 'util';
import { _iterableDiffersFactory } from '@angular/core/src/application_module';

export interface Options {};

@Component({
  selector: 'app-catacomb',
  templateUrl: './catacomb.component.html'
})
export class CatacombComponent implements OnInit {
  catacombs:any[] = [];
  comments: any[] = [];
  objects: any[] = [];
  catacomb: any = null;
  isCatacombsLoading:boolean = false;
  isCatacombDetailsOpen:boolean = false;
  isMovingIntoDane:boolean = false;
  isOpeningGate:boolean = false;
  isInDane:boolean = false;
  selectedCatacombDetailTab:string = null;
  catacombBoardImageUrl:string = null;
  noticeBoardImageUrl:string = null;
  totalCatacombs:number = 0;
  catacombStartPosition:number = 0;
  catacombsPlaceId:number = 3;
  catacombSize:number = 512;
  currentLang:string = null;
  catacombUserImage:string = null;
  isRemeberanceFormOpen:boolean = false;
  condolenceMessage:string = null;
  condolenceSignature:string = null;
  selectedCatacombId:number;
  selectedCatacombName:string;
  router:Router = null;
  options:Options = {};
  
  constructor(private translate: TranslateService, 
    private route: ActivatedRoute, 
    private dataService: DataService, 
    private messageService:MessageService, 
    private _global: AppGlobals, 
    private imageService:ImageService,
    private _router: Router) { 
       this.router = _router;
  }

  ngOnInit() {
    if(this.imageService.cachedImages.length == 0)
      this.router.navigateByUrl('/home');

    this.isCatacombsLoading = true;
    this.selectedCatacombDetailTab = 'tab1';

    this.options = this._global.refreshObject(this.options, ['limit=20', 'position=0', 'place_id='+this.catacombsPlaceId, 'order=user_id']);
    this.dataService.getAllWithMethodAndOptions('PERSONS', this._global.serializeAndURIEncode(this.options))
      .subscribe(catacombs => {
        this.catacombs = catacombs;
        this.totalCatacombs = catacombs.length;
        this.catacombStartPosition = 0;
        for(let i=0; i<=catacombs.length-1;i++){
          if(catacombs[i].place_id == 3) {
            catacombs[i].imageUrl = 'url(./assets/images/graves/katak'+catacombs[i].grave_id+'_'+catacombs[i].grave_image+'.png)';
          }
        }
        this.isCatacombsLoading = false;
      });

      this.messageService.castMessage.subscribe(object => {
        let message = object.message;
  
        switch(message){
          case "RELOAD_CATACOMB_OBJECTS":
            this.options = this._global.refreshObject(this.options, ['object_name=znicz', 'user_id='+this.selectedCatacombId]);
            this.dataService.getAllWithMethodAndOptions('PERSON_OBJECTS', this._global.serializeAndURIEncode(this.options))
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
            break;
        }
      });

    this.currentLang = this._global.getLanguage();
    let context = this;
    window.addEventListener("load",function(){
      document.querySelector('#content.loading-bg').addEventListener("mousemove", context.mouseMove);
      document.querySelector('#content.loading-bg').addEventListener("mouseup", context.mouseUp);
      document.querySelector('#content.loading-bg').addEventListener("mousedown", context.mouseDown); 
    });
  }

  nextCrypt(){
    if(this.catacombStartPosition == ((this.totalCatacombs - 2) * this.catacombSize ))
      return;

    this.catacombStartPosition += this.catacombSize;
  }

  previousCrypt(){
    if(this.catacombStartPosition >= this.catacombSize)
      this.catacombStartPosition -= this.catacombSize;
  }

  backToMainGate(){
    this.router.navigateByUrl('/noticeboard');
  }

  openGate(){
    this.isOpeningGate = true;
    setTimeout(()=>{
      this.isMovingIntoDane = true;
      setTimeout(()=>{
        this.isInDane = true;
      }, 3000);
    }, 3000);
  }
  showCatacombDetails(catacomb:any): void{
    this.selectedCatacombId = catacomb.user_id;
    this.isCatacombDetailsOpen = true;
    this.selectedCatacombDetailTab = 'tab1';
    
    this.catacomb = null;
    this.catacombUserImage = null;
    this.options = this._global.refreshObject(this.options, ['limit=10', 'position=0', 'user_id='+catacomb.user_id]);
    this.dataService.getAllWithMethodAndOptions('PERSON_DETAILS', this._global.serializeAndURIEncode(this.options))
      .subscribe(catacombs => {
        this.catacomb = catacombs[0];
        this.selectedCatacombName = this.catacomb.name1 +' '+this.catacomb.surname;
      }
    );
    
    this.options = this._global.refreshObject(this.options, ['user_id='+catacomb.user_id]);
    this.dataService.getAllWithMethodAndOptions('PERSON_COMMENTS', this._global.serializeAndURIEncode(this.options))
      .subscribe(data => {
        this.comments = data;
      }
    );

    this.options = this._global.refreshObject(this.options, ['user_id='+catacomb.user_id]);
    this.dataService.getAllWithMethodAndOptions('PERSON_PHOTOS', this._global.serializeAndURIEncode(this.options))
      .subscribe(data => {
        if(data && data.length > 0){
          this.catacombUserImage = './assets/images/zdjecia/large/'+data[0].file_name;
        }
      }
    );

    this.options = this._global.refreshObject(this.options, ['object_name=znicz', 'user_id='+catacomb.user_id]);
    this.dataService.getAllWithMethodAndOptions('PERSON_OBJECTS', this._global.serializeAndURIEncode(this.options))
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
    this.isCatacombDetailsOpen = false;
  }
  openTab(tabName:string):void{
    this.selectedCatacombDetailTab = tabName;
  }
  openRememberanceForm(){
    this.isRemeberanceFormOpen = true;
  }
  closeRememberanceForm(){
    this.isRemeberanceFormOpen = false;
  }
  addCondolence(){
    this.options = this._global.refreshObject(this.options, ['nick='+this.condolenceSignature, 
    'body='+this.condolenceMessage, 'user_id='+this.selectedCatacombId, 'method=COMMENT']);
    this.dataService.createWithMethodAndOptions(this.options)
      .subscribe(result => {
        this.options = this._global.refreshObject(this.options, ['user_id='+this.selectedCatacombId]);
        this.dataService.getAllWithMethodAndOptions('PERSON_COMMENTS', this._global.serializeAndURIEncode(this.options))
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
  shopObjects(){
    if(this.selectedCatacombId){
      this.messageService.sendMessage('OPEN_SHOP', {
          'selectedCatacomb': this.selectedCatacombId,
          'selectedCatacombName': this.selectedCatacombName
        });
    }
  }
}
