import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { DataService } from '../services/data.service';
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
  router:Router = null;
  options:Options = {};
  
  constructor(private translate: TranslateService, 
    private route: ActivatedRoute, 
    private dataService: DataService, 
    private _global: AppGlobals, 
    private _router: Router) { 
    this.router = _router;
  }

  ngOnInit() {
    this.isCatacombsLoading = true;
    this.selectedCatacombDetailTab = 'tab1';

    this.options = this._global.refreshObject(this.options, ['limit=20', 'position=0', 'place_id='+this.catacombsPlaceId, 'order=user_id']);
    this.dataService.getAllWithMethodAndOptions('GRAVES', this._global.serializeAndURIEncode(this.options))
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

    this.currentLang = this._global.getLanguage();
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
    this.isCatacombDetailsOpen = true;
    this.selectedCatacombDetailTab = 'tab1';
    
    this.catacomb = null;
    this.catacombUserImage = null;
    this.options = this._global.refreshObject(this.options, ['limit=10', 'position=0', 'user_id='+catacomb.user_id]);
    this.dataService.getAllWithMethodAndOptions('GRAVE_DETAILS', this._global.serializeAndURIEncode(this.options))
      .subscribe(catacombs => {
        this.catacomb = catacombs[0];
      }
    );
    
    this.options = this._global.refreshObject(this.options, ['user_id='+catacomb.user_id]);
    this.dataService.getAllWithMethodAndOptions('GRAVE_COMMENTS', this._global.serializeAndURIEncode(this.options))
      .subscribe(data => {
        this.comments = data;
      }
    );

    this.options = this._global.refreshObject(this.options, ['user_id='+catacomb.user_id]);
    this.dataService.getAllWithMethodAndOptions('GRAVE_USER_PHOTO', this._global.serializeAndURIEncode(this.options))
      .subscribe(data => {
        if(data && data.length > 0){
          this.catacombUserImage = './assets/images/zdjecia/large/'+data[0].file_name;
        }
      }
    );

    this.options = this._global.refreshObject(this.options, ['object_name=znicz', 'user_id='+catacomb.user_id]);
    this.dataService.getAllWithMethodAndOptions('GRAVE_CANDLES', this._global.serializeAndURIEncode(this.options))
      .subscribe(data => {
        this.objects = data;
        for(var i=0; i<=this.objects.length-1; i++)
          this.objects[i]['object_url'] = './assets/images/znicze/'+this.objects[i].object_name+this.objects[i].object_id+'.swf';
      }
    );
  }
  closeDetails(): void{
    this.isCatacombDetailsOpen = false;
  }
  openTab(tabName:string):void{
    this.selectedCatacombDetailTab = tabName;
  }
}
