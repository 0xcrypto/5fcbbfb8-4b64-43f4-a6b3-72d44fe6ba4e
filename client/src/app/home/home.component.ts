import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {Router} from '@angular/router';
import { AppGlobals } from '../app.globals';
import { CookieStorage, LocalStorage, SessionStorage, LocalStorageService } from 'ngx-store';
import { ImageService } from '../services/image.service';
import { MessageService } from '../services/message.service';
import { debug } from 'util';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  host: {
    '(document:mousemove)': 'onMouseMove($event)'
  }
})
export class HomeComponent implements OnInit {
  isGateOpen:boolean=false;
  isReturnedToMainGate:boolean = false;
  isImageLoadingScreenVisible:boolean = false;
  router:Router = null;

  constructor(private _router: Router, 
    private route: ActivatedRoute, 
    private _global: AppGlobals,
    private localStorage:LocalStorageService,
    private imageService:ImageService,
    private messageService:MessageService) {
    this.router = _router;
  }

  ngOnInit() {
    if(!this.imageService.isImagesLoaded){
      this.isImageLoadingScreenVisible = true;
      this.imageService.load();
    }
    
    this.messageService.castMessage.subscribe(object => {
      let message = object.message;
      switch(message){
        case "APP_IMAGES_LOADED":
          this.isImageLoadingScreenVisible = false;
          break;
      }
    });
    //this.messageService.sendMessage('PLAY_BIRDS', {});
  }
  
  ngAfterViewInit(){
    //this.backToMainGate();
  }

  backToMainGate(): void {
    const isReturned = +this.route.snapshot.paramMap.get('isReturned');
    if(isReturned){
      this.isReturnedToMainGate = true;
    }
  }

  openGate() {
    this.isGateOpen = true;
    //this.messageService.sendMessage('PLAY_OPEN_GATE', {});
    setTimeout(()=>{  
      //this.messageService.sendMessage('STOP_BIRDS', {});
      this.router.navigateByUrl('/noticeboard');
    }, 2000);
  }
  
  openPetNoticeboard() {
    //this.messageService.sendMessage('STOP_BIRDS', {});
    this.router.navigateByUrl('/pet-noticeboard');
  }
  
  onMouseMove = (event: MouseEvent) => {
    var image = document.getElementById('logo-gif');
    if(image){
      image.style.position = 'absolute';
      image.style.top = (event.clientY - 50 ) + 'px';
      image.style.left = (event.clientX - 500 ) + 'px';
    }
  }
}


