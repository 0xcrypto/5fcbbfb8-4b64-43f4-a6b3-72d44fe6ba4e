import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {Router} from '@angular/router';
import { AppGlobals } from '../app.globals';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  isGateOpen:boolean=false;
  isReturnedToMainGate:boolean = false;
  isImageLoadingScreenVisible:boolean = false;
  router:Router = null;

  constructor(private _router: Router, private route: ActivatedRoute, private _global: AppGlobals) {
    this.router = _router;
  }

  ngOnInit() {
    window['component'] = this;
    this.loadImages();
  }
  
  ngAfterViewInit(){
    this.backToMainGate();
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

  loadImages(){
    this.isImageLoadingScreenVisible = true;
    var images = new Array();
    
    for (let i = 0; i < this._global.IMAGES.length; i++) {
      var image = document.createElement('img');
      image.src = this._global.IMAGES[i];
      document.querySelector('#images-loading').appendChild(image);
    }

    setTimeout(function(){
      window['component'].isImageLoadingScreenVisible = false;
      document.querySelector('#images-loading').innerHTML = '';
    }, 5000);
  }
}


