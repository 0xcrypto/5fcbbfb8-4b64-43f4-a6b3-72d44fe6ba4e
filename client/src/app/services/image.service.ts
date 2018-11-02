import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest  } from '@angular/common/http';
import { ResponseContentType } from '@angular/http';
import { MessageService } from './message.service';
import { CookieStorage, LocalStorage, SessionStorage, LocalStorageService } from 'ngx-store';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { debug } from 'ngx-store/src/config';
import { AppGlobals } from '../app.globals';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  public imageUrls = [
    'assets/images/bg-bottom.jpg',
    'assets/images/birds-flying.gif',
    'assets/images/blue-sky.png',
    'assets/images/blue-sky-active.png',
    'assets/images/cat-bottom-wall.jpg',
    'assets/images/cat-candle.png',
    'assets/images/cat-dane.png',
    'assets/images/cat-door.png',
    'assets/images/cat-door-light.png',
    'assets/images/cat-floor.jpg',
    'assets/images/cat-main-en.png',
    'assets/images/cat-main-pl.png',
    'assets/images/cat-stand.png',
    'assets/images/cat-wall-minor.jpg',
    'assets/images/day.png',
    'assets/images/day-active.png',
    'assets/images/entrance-board.jpg',
    'assets/images/floating-tile.png',
    'assets/images/gate-left.png',
    'assets/images/gate-right.png',
    'assets/images/header.jpg',
    'assets/images/lion.png',
    'assets/images/loading_cursor.gif',
    'assets/images/logo.gif',
    'assets/images/main-gate.png',
    'assets/images/night.png',
    'assets/images/night-active.png',
    'assets/images/noticeboard.png',
    'assets/images/notice-board.png',
    'assets/images/ok.png',
    'assets/images/ok-active.png',
    'assets/images/option-arrow-down.png',
    'assets/images/option-arrow-right.png',
    'assets/images/option-background.png',
    'assets/images/option-shadow.png',
    'assets/images/rain.gif',
    'assets/images/rain.png',
    'assets/images/rain-active.png',
    'assets/images/random.png',
    'assets/images/random-active.png',
    'assets/images/sky.jpg',
    'assets/images/snow.gif',
    'assets/images/snow.png',
    'assets/images/snow-active.png',
    'assets/images/thunderstrom.gif',
    'assets/images/thunder-strom.png',
    'assets/images/thunder-strom-active.png',
    'assets/images/top-board.png',
    'assets/images/night-active.png',
    'assets/images/vg-left-logo.png',
    'assets/images/vg-logo.png',
    'assets/images/vg-logo-hover.png',
    'assets/images/vg-right-logo.png',
    'assets/images/wall.png',
  ];
  public cachedImages:any[]=[];
  public totalImagesLoaded = 0;
  public isImagesLoaded: boolean;
	private protocol = location.protocol === 'https:' ? 'https' : 'http';
  private baseURL = this.protocol + '://localhost/virtualgrave/client/dist/';  

  constructor(private _global: AppGlobals,
    private http: HttpClient,
    private messageService:MessageService,
    private localStorageService: LocalStorageService) { }

  load(){
    for(let i=0; i<this.imageUrls.length; i++){
      let imageUrl = this.baseURL + this.imageUrls[i];
      this.downloadImage(imageUrl).subscribe((result)=>{
        this.loadImage(this.imageUrls[i], result);
      });
    }
  }

  downloadImage(url:string){
    if(url.indexOf('null') > -1)
      return;

    let contentType = null, extension = url.split('.').pop().toLowerCase();
    if(extension == 'jpg' || extension == 'jpeg'){
      contentType = 'image/jpeg';
    }
    else if(extension == 'png'){
      contentType = 'image/png';
    }
    else if(extension == 'gif'){
      contentType = 'image/gif';
    }

    return this.http.get(url, { 
      headers: new HttpHeaders({'Content-Type': contentType}), 
      responseType: 'blob' 
    });
  }

  loadImage(url:string, image: Blob) {
    let reader = new FileReader();
    if (image) {
        reader.readAsDataURL(image);
    }
    
    reader.addEventListener("load", () => {
        this.cachedImages.push({ url: url, image: reader.result });
        if(this.cachedImages.length == this.imageUrls.length){
          this.isImagesLoaded = true;
          this.messageService.sendMessage('APP_IMAGES_LOADED', {});
        }
    }, false);
  }

  getImage(url:string){
    let imageObj =  this.cachedImages.filter(obj => obj.url === url)[0];

    if(imageObj){
      return imageObj.image;
    }
    else{
      return null;
    }
  }
}
