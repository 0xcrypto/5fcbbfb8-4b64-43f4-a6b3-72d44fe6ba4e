import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { Advertisement } from '../classes/advertisement';
import { AdvertisementService } from '../services/advertisement.service';
import { UsersService } from '../services/users.service';
import { User } from '../classes/user';
import { Options } from 'selenium-webdriver/firefox';
import { AppGlobals } from '../app.globals';

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
  _showform:boolean = true;
  activeTab:string = null;
  currentLang:string = null;
  totalUsers: number = 0;
  totalSearchedUsers: number = 0;
  totalUserPages: number = 0;
  totalSearchedUserPages: number = 0;
  userPages: number[] = [];
  userSearchedPages: number[] = [];
  
  _userFirstname:string = null;
  _userSurname:string = null;
  _userDob:string = null;
  _userDod:string = null;

  loadingUserData:boolean = false;
  loadingSearchUserData:boolean = false;
  alphabetPages: any[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  advertisements: Advertisement[] = [];
  users: User[] = [];
  searchedUsers: User[] = [];
  tileUsers: User[] = [];
  options: UserOptions = {
    position: 0,
    limit: 10
  };
  searchOptions: UserOptions = {
    position: 0,
    limit: 10
  };
  
  constructor(private translate: TranslateService, private advertisementService: AdvertisementService, private usersService: UsersService, private _global: AppGlobals) {
  }

  ngOnInit() {
    this.getAdvertisements();
    this.activeTab = 'graveyard-noticeboard';
    this.currentLang = this._global.getLanguage();
    this.getTileUsers(encodeURIComponent(this.serialize(this.options)));
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

  getUsersWithName(alphabet: string){
    this.options['firstname'] = alphabet;
    this.getUsers(encodeURIComponent(this.serialize(this.options)));
  }

  getUsersWithPage(position: number){
    this.options['position'] = position;
    this.getUsers(encodeURIComponent(this.serialize(this.options)));
  }

  getSearchedUsersWithName(alphabet: string){
    this.searchOptions['firstname'] = alphabet;
    this.getSearchedUsers(encodeURIComponent(this.serialize(this.searchOptions)));
  }

  getSearchedUsersWithPage(position: number){
    this.searchOptions['position'] = position;
    this.getSearchedUsers(encodeURIComponent(this.serialize(this.searchOptions)));
  }

  showAllUsers(){
    this.options.position = 0;
    this.getUsers(encodeURIComponent(this.serialize(this.options)));
  }

  showAllSearchedUsers(){
    this.searchOptions.position = 0;
    this.getSearchedUsers(encodeURIComponent(this.serialize(this.searchOptions)));
  }

  goNext(){
    if (this.options.position < this.totalUserPages) {
        this.options.position++;
        this.getUsers(encodeURIComponent(this.serialize(this.options)));
    }
  }

  goBack(){
    if (this.options.position > 1) {
      this.options.position--;
      this.getUsers(encodeURIComponent(this.serialize(this.options)));
    }
  }

  goSearchNext(){
    if (this.searchOptions.position < this.totalSearchedUserPages) {
        this.searchOptions.position++;
        this.getSearchedUsers(encodeURIComponent(this.serialize(this.searchOptions)));
    }
  }

  goSearchBack(){
    if (this.searchOptions.position > 1) {
      this.searchOptions.position--;
      this.getSearchedUsers(encodeURIComponent(this.serialize(this.searchOptions)));
    }
  }

  getPages(start: number, total: number){
    let pages: number[] = [];
    if(start >= (total - 5)){
      start = (total - 5);
      for(let i = start, j=1; i <= total; i++, j++){
        pages[j-1] = i;
      }
    }
    else{
      for(let i = 0; i <= 3; i++){
        pages[i] = start + (i+1);
      }
      pages[4] = total;
    }

    return pages;
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
    if(this._userFirstname){
      this.searchOptions['firstname'] = this._userFirstname;
    }

    if(this._userSurname){
      this.searchOptions['lastname'] = this._userSurname;
    }

    if(this._userDob){
      let dateComponent = this._userDob.split('-');
      let validDOB = dateComponent[2]+'-'+dateComponent[1]+'-'+dateComponent[0];
      this.searchOptions['birth_date'] = validDOB;
    }
    
    if(this._userDod){
      let dateComponent = this._userDod.split('-');
      let validDOD = dateComponent[2]+'-'+dateComponent[1]+'-'+dateComponent[0];
      this.searchOptions['death_date'] = validDOD;
    }

    this._showform = false;
    this.getSearchedUsers(encodeURIComponent(this.serialize(this.searchOptions)));
  }

  backToSearch(){
    this._showform = true;
  }

  getAdvertisements(): void {
    this.advertisementService.getAll()
      .subscribe(advertisements => this.advertisements = advertisements);
  }
  updateUserProperties(users: User[]){
    if(this.currentLang == 'en' ){
      for(let i=0; i<=users.length-1;i++){
        if(users[i].place_name == 'cmentarz'){
          users[i].place_name = 'Graveyard';
        }
        else if(users[i].place_name == 'katakumby'){
          users[i].place_name = 'Catacombs';
        }
        else if(users[i].place_name == 'inne - specjalne'){
          users[i].place_name = 'Special';
        }
      }
    }
    return users;
  }

  getUsers(param: string): void {
    this.loadingUserData = true;
    this.usersService.getWithMethodAndOptions('browsing', param)
      .subscribe(users => {
        this.loadingUserData = false;
        this.users = users;
        if(users.length > 0){
          users = this.updateUserProperties(users);
          this.totalUsers = parseInt(users[0].ilosc);
          this.totalUserPages = Math.ceil(this.totalUsers / this.options.limit);
          this.userPages = this.getPages(this.options.position, this.totalUserPages);
        }
      });
  }

  getTileUsers(param: string): void {
    this.usersService.getWithMethodAndOptions('browsing', param)
      .subscribe(users => {
        this.tileUsers = users.slice(0,3);
      });
  }

  getSearchedUsers(param: string): void {
    this.loadingSearchUserData = true;
    this.usersService.getWithMethodAndOptions('browsing', param)
      .subscribe(users => {
        this.loadingSearchUserData = false;
        this.searchedUsers = users;
        if(users.length > 0){
          users = this.updateUserProperties(users);
          this.totalSearchedUsers = parseInt(users[0].ilosc);
          this.totalSearchedUserPages = Math.ceil(this.totalSearchedUsers / this.searchOptions.limit);
          this.userSearchedPages = this.getPages(this.searchOptions.position, this.totalSearchedUserPages);
        }
      });
  }
}
