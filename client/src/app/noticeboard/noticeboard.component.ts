import { Component, OnInit } from '@angular/core';
import { Advertisement } from '../classes/advertisement';
import { AdvertisementService } from '../services/advertisement.service';
import { UsersService } from '../services/users.service';
import { User } from '../classes/user';
import { Options } from 'selenium-webdriver/firefox';

export interface UserOptions {
  position: number;
  limit: number;  
};

@Component({
  selector: 'app-noticeboard',
  templateUrl: './noticeboard.component.html',
  styleUrls: ['./noticeboard.component.css']
})
export class NoticeboardComponent implements OnInit {
  isHiddenTab:boolean = true;
  activeTab:string = null;
  pageSize:number = 10;
  pageNumber:number = 0;
  advertisements: Advertisement[] = [];
  users: User[] = [];
  options: UserOptions = {
    position: this.pageSize,
    limit: this.pageNumber
  };
  
  constructor(private advertisementService: AdvertisementService, private usersService: UsersService) {
  }

  ngOnInit() {
    this.activeTab = 'graveyard-noticeboard';
    this.getAdvertisements();
    debugger;
    this.getUsers(this.options.toString());
  }

  openTab(name:string) {
    this.activeTab = name;
  }
  
  getAdvertisements(): void {
    this.advertisementService.getAll()
      .subscribe(advertisements => this.advertisements = advertisements);
  }

  getUsers(param: string): void {
    this.usersService.getWithMethodAndOptions('browsing', param)
      .subscribe(users => {
        this.users = users;
      });
	  //.slice(1, 5)
  }
}
