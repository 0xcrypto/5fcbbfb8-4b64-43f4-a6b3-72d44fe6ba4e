import { Component, OnInit } from '@angular/core';
import { Advertisement } from '../classes/advertisement';
import { AdvertisementService } from '../services/advertisement.service';
import { UsersService } from '../services/users.service';
import { User } from '../classes/user';
import { Options } from 'selenium-webdriver/firefox';

export interface UserOptions {
  position: number;
  limit: number;  
  firstname: string;
};

@Component({
  selector: 'app-noticeboard',
  templateUrl: './noticeboard.component.html',
  styleUrls: ['./noticeboard.component.css']
})
export class NoticeboardComponent implements OnInit {
  isHiddenTab:boolean = true;
  activeTab:string = null;
  alphabetPages: any[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  advertisements: Advertisement[] = [];
  users: User[] = [];
  options: UserOptions = {
    position: 0,
    limit: 10,
    firstname: "A"
  };
  
  constructor(private advertisementService: AdvertisementService, private usersService: UsersService) {
  }

  ngOnInit() {
    this.activeTab = 'graveyard-noticeboard';
    this.getAdvertisements();
    let options = encodeURIComponent(this.serialize(this.options));
    debugger;
    this.getUsers(options);
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

  showData(data: string){
    this.options.firstname = data;
    this.getUsers(encodeURIComponent(this.serialize(this.options)));
  }

  goNext(){
    this.options.position +=1;
    this.getUsers(encodeURIComponent(this.serialize(this.options)));
  }

  goBack(){
    this.options.position -=1;
    this.getUsers(encodeURIComponent(this.serialize(this.options)));
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
