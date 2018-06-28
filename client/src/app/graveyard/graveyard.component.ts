import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { User } from '../classes/user';
import { UsersService } from '../services/users.service';
import { AppGlobals } from '../app.globals';

export interface UserOptions {
  limit: number;
};

@Component({
  selector: 'app-graveyard',
  templateUrl: './graveyard.component.html'
})
export class GraveyardComponent implements OnInit {
  graves: User[] = [];
  position: number = 0;
  skyImage: string = null;
  graveyardImage: string = null;
  graveyardStartPosition: number = null;
  isRainfallScene:boolean = false;
  isSnowfallScene:boolean = false;
  isThunderstromScene:boolean = false;
  router:Router = null;
  totalGraves: number = 0;
  graveSize: number = 512;
  options: UserOptions = {
    limit: 10
  };

  constructor(private route: ActivatedRoute, private usersService: UsersService, private _global: AppGlobals, private _router: Router) { 
    this.router = _router;
  }

  ngOnInit() {
    let position = +this.route.snapshot.paramMap.get('position');
    let scene = this.route.snapshot.paramMap.get('scene');
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
    this.graveyardImage = 'url(./assets/images/graveyard-backgrounds/'+this._global.getGraveyardImage(scene)+')';
    this.options['position'] = position;
    this.options['order'] = 'user_id';
    this.getGrave(this._global.serializeAndURIEncode(this.options));
  }

  backToSearchResults(){
    this.router.navigateByUrl('/noticeboard');
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

  getGrave(param: string): void {
    this.usersService.getWithMethodAndOptions('browsing', param)
      .subscribe(graves => {
        this.graves = graves.reverse();
        this.totalGraves = graves.length;
        this.graveyardStartPosition = ((this.totalGraves - 2) * this.graveSize );
        for(let i=0; i<=graves.length-1;i++){
          //graves[i].graveUrl = 'url(./assets/images/graves/grob'+graves[i].grave_id+'_'+graves[i].grave_image+'.png)';
          graves[i].graveUrl = 'url(./assets/images/graves/grob1_'+graves[i].grave_image+'.png)';
        }
      });
  }
}
