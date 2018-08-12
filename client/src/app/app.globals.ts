import { Injectable } from '@angular/core';

interface GraveyardImages {
  scene: string;
  sky: string;
  graveyard: string;
}

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
  private language: string = 'en';
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
  }, ]

  setLanguage(language:string) {
    this.language = language;
  }

  getLanguage(): string {
    return this.language;
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
}