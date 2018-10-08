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
  templateUrl: './home.component.html'
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
    this.isImageLoadingScreenVisible = true;
    this.imageService.load();
    this.messageService.castMessage.subscribe(object => {
      let message = object.message;
      switch(message){
        case "APP_IMAGES_LOADED":
          this.isImageLoadingScreenVisible = false;
          break;
      }
    });
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
    setTimeout(()=>{  
      this.router.navigateByUrl('/noticeboard');
    }, 1000);
  }
  
  openPetNoticeboard() {
    this.router.navigateByUrl('/pet-noticeboard');
  }
  
}


