import { Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { User } from '../classes/user';
import { DataService } from '../services/data.service';
import { MessageService } from '../services/message.service';
import { ImageService } from '../services/image.service';
import { AppGlobals } from '../app.globals';
import { _iterableDiffersFactory } from '@angular/core/src/application_module';
import { CookieStorage, LocalStorage, SessionStorage, LocalStorageService } from 'ngx-store';

export interface UserOptions {
  limit: number;
};

@Component({
  selector: 'app-graveyard',
  templateUrl: './person-graveyard.component.html',
  host: {
    '(document:mousemove)': 'onMouseMove($event)'
  }
})
export class PersonGraveyardComponent implements OnInit {
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
  isGraveyardLoading:boolean = false;
  isSceneSelectionInProgress: boolean = true;
  isRemeberanceFormOpen:boolean = false;
  condolenceMessage:string = null;
  condolenceSignature:string = null;
  selectedGraveId:number = 0;
  selectedGraveName:string = null;
  isMultigraveOpen:boolean;
  multigraveStartPosition:number;
  totalMultigraves: number;
  router:Router = null;
  totalGraves: number = 0;
  graveSize: number = 512;
  multigraveSize: number = 512;
  selectedSceneTime:number = 1;
  selectedSceneSeason:number = 1;
  isRandomSceneSelected:boolean = false;
  options: UserOptions = {
    limit: 10
  };

  constructor(private route: ActivatedRoute, 
    private dataService: DataService,
    private messageService:MessageService, 
    private _global: AppGlobals, 
    private _router: Router,
    private imageService:ImageService,
    private localStorageService: LocalStorageService) { 
    this.router = _router;
  }

  ngOnInit() {
    if(!this.imageService.isImagesLoaded)
      this.router.navigateByUrl('/home');

    let position = +this.route.snapshot.paramMap.get('position');
    if(this.localStorageService.get(this._global.GRAVEYARD_OPTIONS_KEY)){
      let searchOptions = this.localStorageService.get(this._global.GRAVEYARD_OPTIONS_KEY).split('|');
      this.options = this._global.refreshObject(this.options, searchOptions);
    }
    else{
      this.options = this._global.refreshObject(this.options, ['limit=10', 'position='+position, 'order=user_id']);
    }

    this.selectedGraveDetailTab = 'tab1';
    
    this.messageService.castMessage.subscribe(object => {
      let message = object.message;
      let data = object.data;
      
      switch(message){
        case "RELOAD_PERSON_OBJECTS":
          this.options = this._global.refreshObject(this.options, ['user_id=' + data.id]);
          this.dataService.getAllWithMethodAndOptions('PERSON_OBJECTS', this._global.serializeAndURIEncode(this.options))
            .subscribe(result => {
              if(result.length > 0){
                this.objects = this.updateObjectImages(result);
                this.updateGraveObjects(this.objects, data.id);
              }
            }
          );
          break;
      }
    });
  }

  backToSearchResults(){
    this.router.navigateByUrl('/noticeboard');
  }

  updateGraveObjects(objects: any, id: any){
    var grave = this.graves.find(grave => grave.user_id == id);
    if(grave){
      grave['objects'] = objects;
    }
    else{
      this.graves.forEach( (grave, index) => {
        var multigrave = grave.multigrave.find(mgrave => mgrave.user_id == id);
        if(multigrave){
          multigrave['objects'] = objects;
        }
      });
    }
  }

  updateObjectImages(objects: any){
    for(var j=0; j<=objects.length-1; j++) {
      switch(objects[j].object_name) {
        case 'kwiat': 
          objects[j]['object_url'] = './assets/images/znicze/kwiat'+objects[j].object_id+'.png';
          break;
        case 'inne': 
          objects[j]['object_url'] = './assets/images/znicze/inne'+objects[j].object_id+'.png';
          break;
        case 'kamien': 
          objects[j]['object_url'] = './assets/images/znicze/kamien'+objects[j].object_id+'.png';
          break;
        case 'znicz':
          objects[j]['object_url'] = './assets/images/znicze/znicz'+objects[j].object_id+'.gif';
          break;
      }
    }
    return objects;
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

  showGraveDetails(grave:any): void{
    this.selectedGraveId = grave.user_id;
    this.isGraveDetailsOpen = true;
    this.selectedGraveDetailTab = 'tab1';
    
    this.grave = null;
    this.graveUserImage = null;
    this.options = this._global.refreshObject(this.options, ['limit=10', 'position=0', 'user_id='+grave.user_id]);
    this.dataService.getAllWithMethodAndOptions('PERSON_DETAILS', this._global.serializeAndURIEncode(this.options))
      .subscribe(graves => {
        this.grave = graves[0];
        this.selectedGraveName = this.grave.name1 +' '+this.grave.surname;
      }
    );
    
    this.options = this._global.refreshObject(this.options, ['user_id='+grave.user_id]);
    this.dataService.getAllWithMethodAndOptions('PERSON_COMMENTS', this._global.serializeAndURIEncode(this.options))
      .subscribe(data => {
        if(data.length > 0)
          this.comments = data;
      }
    );

    this.options = this._global.refreshObject(this.options, ['user_id='+grave.user_id]);
    this.dataService.getAllWithMethodAndOptions('PERSON_PHOTOS', this._global.serializeAndURIEncode(this.options))
      .subscribe(data => {
        if(data.length > 0 )
          this.graveUserImage = './assets/images/zdjecia/large/'+data[0].file_name;
      }
    );

    this.options = this._global.refreshObject(this.options, ['user_id='+grave.user_id]);
    this.dataService.getAllWithMethodAndOptions('PERSON_OBJECTS', this._global.serializeAndURIEncode(this.options))
      .subscribe(data => {
        if(data.length > 0)
          this.objects = this.updateObjectImages(data);
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
    this.options = this._global.refreshObject(this.options, ['nick='+this.condolenceSignature, 'body='+this.condolenceMessage, 
    'user_id='+this.selectedGraveId, 'method=PERSON_COMMENT']);
    this.dataService.createWithMethodAndOptions(this.options)
      .subscribe(result => {
        if(result){
          if(result['status'] == 'PERSON_COMMENT_ERROR'){
            this.messageService.sendMessage('OPEN_CUSTOM_DIALOG', {'translationKey': 'ADD_COMMENT_ERROR' });
          }
          else{
            this.options = this._global.refreshObject(this.options, ['user_id='+this.selectedGraveId]);
            this.dataService.getAllWithMethodAndOptions('PERSON_COMMENTS', this._global.serializeAndURIEncode(this.options))
              .subscribe(comments => {
                this.comments = comments;
                this.isRemeberanceFormOpen = false;
              }
            );
          }
        }
      });
  }

  onMouseMove = (event: MouseEvent) => {
    var image = document.getElementById('logo-gif');
    if(image){
      image.style.position = 'absolute';
      image.style.top = (event.clientY - 50 ) + 'px';
      image.style.left = (event.clientX - 500 ) + 'px';
    }
  }

  shopObjects(){
    if(this.selectedGraveId){
      this.messageService.sendMessage('OPEN_SHOP', {
          'selectedGrave': this.selectedGraveId,
          'selectedGraveName': this.selectedGraveName
        });
    }
  }
  
  openShop(grave: any){
    this.selectedGraveId = grave.user_id;
    this.selectedGraveName = grave.name1 +' '+grave.surname;

    if(this.selectedGraveId){
      this.messageService.sendMessage('OPEN_SHOP', {
        'selectedGrave': this.selectedGraveId,
        'selectedGraveName': this.selectedGraveName
      });
    }
  }

  openMultigrave(multigraves){
    this.isMultigraveOpen = true;
    this.multigraveStartPosition = 0;
    this.totalMultigraves = multigraves.length;
    this.graveSize = multigraves.length * this.multigraveSize;
  }

  backToGraveyardFromMultigrave(){
    this.isMultigraveOpen = false;
    this.graveSize = this.multigraveSize;
  }

  nextMultigrave(){
    if(this.multigraveStartPosition == ((this.totalMultigraves - 2) * this.multigraveSize ))
    return;

    this.multigraveStartPosition += this.multigraveSize;
  }

  previousMultigrave(){
    if(this.multigraveStartPosition >= this.multigraveSize)
      this.multigraveStartPosition -= this.multigraveSize;
  }

  setSceneTime(time:number){
    this.selectedSceneTime = time;
  }

  setSceneSeason(season:number){
    this.selectedSceneSeason = season;
  }

  randomSceneSelection(){
    this.isRandomSceneSelected = true;
    this.selectedSceneTime = this._global.getRandomNumber(1,2);
    this.selectedSceneSeason = this._global.getRandomNumber(1,4);
  }

  showGraveyard(){
    this.isSceneSelectionInProgress = false;

    let scene = this.selectedSceneTime +'_'+this.selectedSceneSeason;
    let season = this.selectedSceneSeason;

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
    
    this.isGraveyardLoading = true;
    this.dataService.getAllWithMethodAndOptions('PERSONS', this._global.serializeAndURIEncode(this.options))
    .subscribe(graves => {
      this.graves = graves.reverse();
      this.totalGraves = graves.length;
      this.graveyardStartPosition = ((this.totalGraves - 2) * this.graveSize );
      for(let i=0; i<=graves.length-1;i++){
        graves[i].grave_id = Number(graves[i].grave_id);
        let imageName = 'grob'+graves[i].grave_id+'_'+graves[i].grave_image;
        if(graves[i].grave_id == 1 || graves[i].grave_id == 2){
          graves[i].graveImageUrl = 'url(./assets/images/graves/'+imageName+'.png)';
        }
        if(graves[i].grave_id == 3){
          graves[i].graveImageUrl = 'url(./assets/images/graves/'+imageName+'/building-full.png)';
          graves[i].multigraveFloorImage = 'url(./assets/images/graves/'+imageName+'/floor.jpg)';
          graves[i].multigraveWallImage = 'url(./assets/images/graves/'+imageName+'/wall.jpg)';
          graves[i].multigraveStoneImage = 'url(./assets/images/graves/'+imageName+'/stone.png)';
          graves[i].multigraveStoneSlabImage = 'url(./assets/images/graves/'+imageName+'/slab.png)';
         
          for(let j=0; j <= graves[i].multigrave.length - 1; j++){
            if(this.graves[i].multigrave[j]['objects'].length > 0){
              this.graves[i].multigrave[j]['objects'] = this.updateObjectImages(this.graves[i].multigrave[j]['objects']);
            }
          }
        }
      }

      for(let i=0; i<=graves.length-1;i++){
        if(this.graves[i]['objects'].length > 0){
          this.graves[i]['objects'] = this.updateObjectImages(this.graves[i]['objects']);
        }
      }

      this.isGraveyardLoading = false;
    });
  }
}