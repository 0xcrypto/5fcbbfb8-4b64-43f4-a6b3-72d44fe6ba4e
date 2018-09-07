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
  isImageLoadingCompleted:boolean = false;
  router:Router = null;

  constructor(private _router: Router, private route: ActivatedRoute, private _global: AppGlobals) {
    this.router = _router;
    this.loadImages();
  }

  ngOnInit() {}
  
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
    var images = new Array(), total = this._global.IMAGES.length, loadedTotalImages = 0;
    for (let i = 0; i < this._global.IMAGES.length; i++) {
      images[i] = new Image();
      images[i].src = this._global.IMAGES[i];
      images[i].onload = function (){
        loadedTotalImages++;
        if(loadedTotalImages == total){debugger;
          this.isImageLoadingCompleted = true;
        }
      }
    }
  }
}


