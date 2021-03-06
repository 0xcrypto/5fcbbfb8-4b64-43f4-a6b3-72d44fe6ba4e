import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { User } from '../classes/user';
import { DataService } from '../services/data.service';
import { MessageService } from '../services/message.service';
import { ImageService } from '../services/image.service';
import { AppGlobals } from '../app.globals';
import { debug } from 'util';
import { _iterableDiffersFactory } from '@angular/core/src/application_module';
import { CookieStorage, LocalStorage, SessionStorage, LocalStorageService } from 'ngx-store';

export interface UserOptions {};

@Component({
  selector: 'app-animal-graveyard',
  templateUrl: './animal-graveyard.component.html',
  host: {
    '(document:mousemove)': 'onMouseMove($event)'
  }
})
export class AnimalGraveyardComponent implements OnInit {
  animals: any[] = [];
  comments: any[] = [];
  objects: any[] = [];
  animal: any = null;
  position: number = 0;
  skyImage: string = null;
  animalImage: string = null;
  graveyardImage: string = null;
  selectedAnimalDetailTab: string = null;
  graveyardStartPosition: number = null;
  isRainfallScene:boolean = false;
  isSnowfallScene:boolean = false;
  isGraveDetailsOpen:boolean = false;
  isThunderstromScene:boolean = false;
  isGraveyardLoading:boolean = false;
  isSceneSelectionInProgress:boolean = true;
  isRemeberanceFormOpen:boolean = false;
  condolenceMessage:string = null;
  condolenceSignature:string = null;
  selectedAnimalId:number = 0;
  selectedAnimalName:string = null;
  router:Router = null;
  totalAnimals: number = 0;
  graveSize: number = 512;
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
    if(this.localStorageService.get(this._global.ANIMAL_GRAVEYARD_OPTIONS_KEY)){
      let searchOptions = this.localStorageService.get(this._global.ANIMAL_GRAVEYARD_OPTIONS_KEY).split('|');
      this.options = this._global.refreshObject(this.options, searchOptions);
    }
    else{
      this.options = this._global.refreshObject(this.options, ['limit=10', 'position='+position, 'order=animal_id']);
    }

    this.selectedAnimalDetailTab = 'tab1';

    this.messageService.castMessage.subscribe(object => {
      let message = object.message;
      let data = object.data;

      switch(message){
        case "RELOAD_ANIMAL_OBJECTS":
          this.options = this._global.refreshObject(this.options, ['id='+ + data.id]);
          this.dataService.getAllWithMethodAndOptions('ANIMAL_OBJECTS', this._global.serializeAndURIEncode(this.options))
            .subscribe(result => {
              if(result.length > 0){
                this.objects = this.updateObjectImages(result);
                this.updateAnimalObjects(this.objects, data.id);
              }
            }
          );
          break;
      }
    });
  }

  updateAnimalObjects(objects: any, id: any){
    var animal = this.animals.filter(animal => animal.animal_id == id)[0];
    animal['objects'] = objects;
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

  backToSearchResults(){
    this.router.navigateByUrl('/pet-noticeboard');
  }

  nextGrave(){
    if(this.graveyardStartPosition >= this.graveSize)
      this.graveyardStartPosition -= this.graveSize;
  }

  previousGrave(){
    if(this.graveyardStartPosition == ((this.totalAnimals - 2) * this.graveSize ))
      return;

    this.graveyardStartPosition += this.graveSize;
  }

  showGraveDetails(animal:any): void{
    this.selectedAnimalId = animal.animal_id;
    this.isGraveDetailsOpen = true;
    this.selectedAnimalDetailTab = 'tab1';
    
    this.animal = null;
    this.animalImage = null;
    this.options = this._global.refreshObject(this.options, ['id='+animal.animal_id]);
    this.dataService.getAllWithMethodAndOptions('ANIMAL_DETAILS', this._global.serializeAndURIEncode(this.options))
      .subscribe(animals => {
        if(animals.length > 0){
          this.animal = animals[0];
          this.selectedAnimalName = this.animal.name +' '+this.animal.name2;
        }
      }
    );
    
    this.options = this._global.refreshObject(this.options, ['id='+animal.animal_id]);
    this.dataService.getAllWithMethodAndOptions('ANIMAL_COMMENTS', this._global.serializeAndURIEncode(this.options))
      .subscribe(data => {
        if(data.length > 0)
          this.comments = data;
      }
    );

    this.options = this._global.refreshObject(this.options, ['id='+animal.animal_id]);
    this.dataService.getAllWithMethodAndOptions('ANIMAL_PHOTOS', this._global.serializeAndURIEncode(this.options))
      .subscribe(data => {
        if(data.length > 0 )
          this.animalImage = './assets/images/zdjecia/large/'+data[0].file_name;
      }
    );

    this.options = this._global.refreshObject(this.options, ['id='+animal.animal_id]);
    this.dataService.getAllWithMethodAndOptions('ANIMAL_OBJECTS', this._global.serializeAndURIEncode(this.options))
      .subscribe(data => {
        if(data.length > 0 )
          this.objects = this.updateObjectImages(data);
      }
    );
  }
  
  closeDetails(): void{
    this.isGraveDetailsOpen = false;
  }

  openTab(tabName:string):void{
    this.selectedAnimalDetailTab = tabName;
  }

  openRememberanceForm(){
    this.isRemeberanceFormOpen = true;
  }

  closeRememberanceForm(){
    this.isRemeberanceFormOpen = false;
  }

  addCondolence(){
    this.options = this._global.refreshObject(this.options, ['method=ANIMAL_COMMENT', 'nick='+this.condolenceSignature, 
    'body='+this.condolenceMessage, 'animal_id='+this.selectedAnimalId]);
    this.dataService.createWithMethodAndOptions(this.options)
      .subscribe(result => {
        if(result){
          if(result['status'] == 'ANIMAL_NOT_EXISTS'){
            this.messageService.sendMessage('OPEN_CUSTOM_DIALOG', {'translationKey': 'ANIMAL_NOT_EXISTS' });
          }
          else if(result['status'] == 'ANIMAL_COMMENT_ERROR'){
            this.messageService.sendMessage('OPEN_CUSTOM_DIALOG', {'translationKey': 'ADD_COMMENT_ERROR' });
          }
          else{
            this.options = this._global.refreshObject(this.options, ['id='+this.selectedAnimalId]);
            this.dataService.getAllWithMethodAndOptions('ANIMAL_COMMENTS', this._global.serializeAndURIEncode(this.options))
              .subscribe(comments => {
                this.comments = comments;
                this.isRemeberanceFormOpen = false;
              }
            );
          }
        }
      });
  }

  shopObjects(){
    if(this.selectedAnimalId){
      this.messageService.sendMessage('OPEN_SHOP', {
          'selectedAnimal': this.selectedAnimalId,
          'selectedAnimalName': this.selectedAnimalName
        });
    }
  }
  
  openShop(animal: any){
    this.selectedAnimalId = animal.animal_id;
    this.selectedAnimalName = animal.name +' '+animal.name2;

    if(this.selectedAnimalId){
      this.messageService.sendMessage('OPEN_SHOP', {
          'selectedAnimal': this.selectedAnimalId,
          'selectedAnimalName': this.selectedAnimalName
        });
    }
  }

  onMouseMove = (event: MouseEvent) => {
    var image = document.getElementById('logo-gif');
    if(image){
      image.style.position = 'absolute';
      image.style.top = (event.clientY - 50 ) + 'px';
      image.style.left = (event.clientX - 500 ) + 'px';
    }
  }

  setSceneTime(time:number){
    this.isRandomSceneSelected = false;
    this.selectedSceneTime = time;
  }

  setSceneSeason(season:number){
    this.isRandomSceneSelected = false;
    this.selectedSceneSeason = season;
  }

  randomSceneSelection(){
    this.isRandomSceneSelected = true;
    this.selectedSceneTime = this._global.getRandomNumber(1,2);
    this.selectedSceneSeason = this._global.getRandomNumber(1,4);
  }

  showGraveyard(){
    this.isSceneSelectionInProgress = false;

    let scene = this.selectedSceneTime+'_'+this.selectedSceneSeason;
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
    this.graveyardImage = 'url(./assets/images/graveyard-backgrounds/'+this._global.getAnimalGraveyardImage(scene)+')';
    this.isGraveyardLoading = true;
    this.dataService.getAllWithMethodAndOptions('ANIMALS', this._global.serializeAndURIEncode(this.options))
      .subscribe(animals => {
        this.animals = animals.reverse();
        this.totalAnimals = animals.length;
        this.graveyardStartPosition = ((this.totalAnimals - 2) * this.graveSize );
        for(let i=0; i<=animals.length-1;i++){
          //animals[i].graveUrl = 'url(./assets/images/animals/grob'+animals[i].grave_id+'_'+animals[i].grave_image+'.png)';
          animals[i].graveUrl = 'url(./assets/images/graves/grob_zw1_' + animals[i].grave_image + '.png)';
        }

        for(let i=0; i<=animals.length-1;i++){
          if(this.animals[i]['objects'].length > 0){
            this.animals[i]['objects'] = this.updateObjectImages(this.animals[i]['objects']);
          }
        }

        this.isGraveyardLoading = false;
      });
    
  }
}
