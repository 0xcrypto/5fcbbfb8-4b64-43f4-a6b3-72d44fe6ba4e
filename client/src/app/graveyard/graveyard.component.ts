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
  templateUrl: './graveyard.component.html',
  styleUrls: ['./graveyard.component.css']
})
export class GraveyardComponent implements OnInit {
  graves: User[] = [];
  position: number = 0;
  skyImage: string = null;
  graveyardImage: string = null;
  graveyardStartPosition: number = null;
  router:Router = null;
  totalGraves: number = 0;
  options: UserOptions = {
    limit: 10
  };

  constructor(private route: ActivatedRoute, private usersService: UsersService, private _global: AppGlobals, private _router: Router) { 
    this.router = _router;
  }

  ngOnInit() {
    let position = +this.route.snapshot.paramMap.get('position');
    let scene = this.route.snapshot.paramMap.get('scene');
    this.skyImage = 'url(./assets/images/sky/'+this._global.getSkyImage(scene)+')';
    this.graveyardImage = 'url(./assets/images/graveyard-backgrounds/'+this._global.getGraveyardImage(scene)+')';
    this.options['position'] = position;
    this.getGrave(this._global.serializeAndURIEncode(this.options));
  }

  backToSearchResults(){
    this.router.navigateByUrl('/noticeboard');
  }

  nextGrave(){
    if(this.graveyardStartPosition >= 500)
      this.graveyardStartPosition -= 500;
  }

  previousGrave(){
    if(this.graveyardStartPosition <= ((this.totalGraves - 2) * 500 ))
      this.graveyardStartPosition += 500;
  }

  getGrave(param: string): void {
    this.usersService.getWithMethodAndOptions('browsing', param)
      .subscribe(graves => {
        this.graves = graves;
        this.totalGraves = graves.length;
        this.graveyardStartPosition = ((this.totalGraves - 2) * 500 );
        for(let i=0; i<=graves.length-1;i++){
          graves[i].graveUrl = 'url(./assets/images/graves/grob1_'+graves[i].grave_image+'.png)';
        }
      });
  }
}
