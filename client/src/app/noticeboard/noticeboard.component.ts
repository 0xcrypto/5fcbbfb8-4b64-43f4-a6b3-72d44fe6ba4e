import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
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
  showSearchForm:boolean = true;
  activeTab:string = null;

  _userFirstname:string = null;
  _userSurname:string = null;
  _userDob:string = null;
  _userDod:string = null;

  alphabetPages: any[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  advertisements: Advertisement[] = [];
  users: User[] = [];
  options: UserOptions = {
    position: 0,
    limit: 10
  };
  
  constructor(private advertisementService: AdvertisementService, private usersService: UsersService) {
  }

  ngOnInit() {
    this.getAdvertisements();
    this.activeTab = 'graveyard-noticeboard';
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

  searchUsersByName(alphabet: string){
    this.options['firstname'] = alphabet;
    this.getUsers(encodeURIComponent(this.serialize(this.options)));
  }

  showAllUsers(){
    this.options.position = 0;
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
    if(name == 'book-of-dead'){
      let options = encodeURIComponent(this.serialize(this.options));
      this.getUsers(options);
    }
    else if(name == 'graveyard-noticeboard'){
      this.getAdvertisements();
    }
  }
  
  searchUsers(){
    debugger;
    if(this._userFirstname){
      this.options['firstname'] = this._userFirstname;
    }

    if(this._userSurname){
      this.options['lastname'] = this._userSurname;
    }

    if(this._userDob){
      let dateComponent = this._userDob.split('-');
      let validDOB = dateComponent[2]+'-'+dateComponent[1]+'-'+dateComponent[0];
      this.options['birth_date'] = validDOB;
    }
    
    if(this._userDod){
      let dateComponent = this._userDod.split('-');
      let validDOD = dateComponent[2]+'-'+dateComponent[1]+'-'+dateComponent[0];
      this.options['death_date'] = validDOD;
    }

    this.showSearchForm = false;
    this.getUsers(encodeURIComponent(this.serialize(this.options)));
  }

  backToSearch(){
    this.showSearchForm = false;
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
