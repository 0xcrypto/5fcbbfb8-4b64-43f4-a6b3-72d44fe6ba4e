import { Injectable } from '@angular/core';

@Injectable()
export class AppGlobals {
  private language: string = 'en';

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
}