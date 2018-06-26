import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { User } from '../classes/user';
import { UsersService } from '../services/users.service';

export interface UserOptions {
  position: number;
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
  time: number = 0;
  season: number = 0;
  daySkyImage: string = 'url(./assets/images/sky/niebo3.jpg)';
  nightSkyImage: string = 'url((./assets/images/sky/rnniebo1.jpg)';
  graveyardImage: string = 'url(./assets/images/graveyard-backgrounds/12.png)';
  options: UserOptions = {
    position: 0,
    limit: 5
  };

  constructor(private route: ActivatedRoute, private usersService: UsersService) { }

  ngOnInit() {
    this.position = +this.route.snapshot.paramMap.get('position');
    this.time = +this.route.snapshot.paramMap.get('time');
    this.season = +this.route.snapshot.paramMap.get('season');
    this.options.position = this.position;
    this.getGrave(encodeURIComponent(this.serialize(this.options)));
  }

  getGrave(param: string): void {
    this.usersService.getWithMethodAndOptions('browsing', param)
      .subscribe(graves => {
        this.graves = graves;
      });
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
}
