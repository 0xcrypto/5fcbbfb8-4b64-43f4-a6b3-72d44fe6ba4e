import { Injectable } from '@angular/core';
import { CookieStorage, LocalStorage, SessionStorage, LocalStorageService } from 'ngx-store';
import { UserService } from './services/user.service';
import { DataService } from './services/data.service';
import * as moment from 'moment'; 
import { User } from './classes/user';

interface GraveyardImages {
  scene: string;
  sky: string;
  graveyard: string;
}
export interface Options {};
/*
  DAY = 1
  NIGHT = 2

  BLUESKY = 1
  RAIN = 2
  THUNDERSTROM = 3
  SNOW = 4
*/

@Injectable()
export class AppGlobals {
  options:Options = {};
  private DEFAULT_LANGUAGE: string = 'en';
  private LANGUAGE_KEY: string = '_lang';
  public GRAVEYARD_OPTIONS_KEY = 'GraveyardOptions';
  public GRAVEYARD_RETURN_TAB = 'GraveyardReturnTab';
  public ANIMAL_GRAVEYARD_OPTIONS_KEY = 'AnimalGraveyardOptions';
  public ANIMAL_GRAVEYARD_RETURN_TAB = 'AnimalGraveyardReturnTab';
  public USER_INFO_KEY = 'UserInfo';
  public IS_GUEST_KEY = 'IsGuest';
  public PAYMENT_METHOD = 1; //PAYPAL
  public LANGUAGES:string[] = ['en', 'pl'];
  public CURRENT_PAGE: string = 'header.menu.main_gate';
  private images: GraveyardImages[] = [{
    scene: '1_1',
    sky: 'niebo3.jpg',
    graveyard: 'tlo8.png'
  }, {
    scene: '1_2',
    sky: 'rniebo3.jpg',
    graveyard: 'tlo8r.png'
  }, {
    scene: '1_3',
    sky: 'rniebo2.jpg',
    graveyard: 'tlo8r.png'
  }, {
    scene: '1_4',
    sky: 'rniebo0.jpg',
    graveyard: 'tlo8s.png'
  }, {
    scene: '2_1',
    sky: 'nniebo2.jpg',
    graveyard: 'tlo8.png'
  }, {
    scene: '2_2',
    sky: 'rnniebo2.jpg',
    graveyard: 'tlo8r.png'
  }, {
    scene: '2_3',
    sky: 'rnniebo3.jpg',
    graveyard: 'tlo8r.png'
  }, {
    scene: '2_4',
    sky: 'rnniebo3.jpg',
    graveyard: 'tlo8s.png'
  }, ];
  private animal_images: GraveyardImages[] = [{
    scene: '1_1',
    sky: 'niebo3.jpg',
    graveyard: 'tlo17.png'
  }, {
    scene: '1_2',
    sky: 'rniebo3.jpg',
    graveyard: 'tlo17r.png'
  }, {
    scene: '1_3',
    sky: 'rniebo2.jpg',
    graveyard: 'tlo17r.png'
  }, {
    scene: '1_4',
    sky: 'rniebo0.jpg',
    graveyard: 'tlo17s.png'
  }, {
    scene: '2_1',
    sky: 'nniebo2.jpg',
    graveyard: 'tlo17.png'
  }, {
    scene: '2_2',
    sky: 'rnniebo2.jpg',
    graveyard: 'tlo17r.png'
  }, {
    scene: '2_3',
    sky: 'rnniebo3.jpg',
    graveyard: 'tlo17r.png'
  }, {
    scene: '2_4',
    sky: 'rnniebo3.jpg',
    graveyard: 'tlo17s.png'
  }, ];
  
  constructor(private localStorageService: LocalStorageService, private dataService: DataService) {
  }
  
  ngInit(){
  }
  setLanguage(language:string) {
    this.localStorageService.set(this.LANGUAGE_KEY, language);
  }

  getLanguage(): string {
    let lang = this.localStorageService.get(this.LANGUAGE_KEY);
    if(lang)
      return lang;
    else{
      this.localStorageService.set(this.LANGUAGE_KEY, this.DEFAULT_LANGUAGE);
      return this.DEFAULT_LANGUAGE;
    }
  }

  serialize(object: any){
    var str = [];
      for (var p in object)
        if (object.hasOwnProperty(p)) {
          if(isNaN(object[p])){
            str.push('"' + encodeURIComponent(p) + '": "'+encodeURIComponent(object[p])+'"');
          }
          else{
            str.push('"' + encodeURIComponent(p) + '": '+encodeURIComponent(object[p]));
          }
        }
      return " { " + str.join(', ') + " } ";
  }

  serializeAndURIEncode(object:any){
    return encodeURIComponent(this.serialize(object));
  }

  getSkyImage(id:string){
    for (let key in this.images) {  
      if(this.images[key].scene == id){
        return this.images[key].sky;
      }
    }
    return null;
  }

  getGraveyardImage(id:string){
    for (let key in this.images) {  
      if(this.images[key].scene == id){
        return this.images[key].graveyard;
      }
    }
    return null;
  }

  getAnimalGraveyardImage(id:string){
    for (let key in this.images) {  
      if(this.animal_images[key].scene == id){
        return this.animal_images[key].graveyard;
      }
    }
    return null;
  }

  getRandomNumber(min:number, max:number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  refreshObject(object:any, values:any[]):any{
    object = {};
    for(var i in values){
      var data = values[i].split('='),
        key = data[0],
        value = data[1];
      
      object[key] = value;
    }
    return object;
  }

  getPagination(start: number, total: number){
    let pages: number[] = [];
    let max_pages:number = (total >= 5) ? 5 : total; 
    
    if((total - start) <= max_pages){
      for(let i = start; i <= total; i++){
        pages.push(i);
      }
    }    
    else if((total - start) > max_pages){
      for(let i = start; i <= start + (max_pages - 1); i++){
        pages.push(i);
      }
    }

    return pages;
  }
}