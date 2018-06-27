import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { Advertisement } from '../classes/advertisement';
import { AdvertisementService } from '../services/advertisement.service';
import { UsersService } from '../services/users.service';
import { User } from '../classes/user';
import { Router } from '@angular/router';
import { AppGlobals } from '../app.globals';

export interface Options {
  limit:number;
};

@Component({
  selector: 'app-noticeboard',
  templateUrl: './noticeboard.component.html'
})
export class NoticeboardComponent implements OnInit {
  isGraveLoadingScreenVisible:boolean = false;
  isSearchFormVisible:boolean = true;
  isNavigatePreviousDeadDisabled:boolean = false;
  isNavigateNextDeadDisabled:boolean = false;
  isNavigatePreviousSearchedDeadDisabled:boolean = false;
  isNavigateNextDeadSearchedDisabled:boolean = false;
  isRandomSceneSelected:boolean = false;
  selectedTab:string = null;
  selectedDeadPosition: number = 0;
  totalDeads: number = 0;
  totalSearchedDeads: number = 0;
  totalPagesInDeadlist: number = 0;
  totalPagesInSearchedDead: number = 0;
  loadingData:boolean = false;
  searchingData:boolean = false;
  selectedDeadPage:number = 1;
  selectedDeadAlphabet:string = null;
  selectedSearchPage:number = 1;
  selectedSearchAlphabet:string = null;
  selectedSceneTime:number = 0;
  selectedSceneSeason:number = 0;
  datalimit = 15;

  deadlistPages: number[] = [];
  searchedDeadPages: number[] = [];
  advertisements: Advertisement[] = [];
  users: User[] = [];
  searchedUsers: User[] = [];
  prioritizeGraves: User[] = [];

  router:Router = null;
  currentLang:string = null;
  alphabetPages: any[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  /* search form properties */
  firstname:string = null;
  surname:string = null;
  dob:string = null;
  dod:string = null;

  options: Options = {
    limit: this.datalimit
  };
  searchOptions: Options = {
    limit: this.datalimit
  };
  
  constructor(private _router: Router, 
    private translate: TranslateService, 
    private advertisementService: AdvertisementService, 
    private usersService: UsersService, 
    private _global: AppGlobals) {
    this.router = _router;
  }

  ngOnInit() {
    this.selectedTab = 'graveyard-noticeboard';
    this.currentLang = this._global.getLanguage();
    this.options.limit = this.datalimit;

    this.getAdvertisements();
    this.options['position'] = 0;
    this.options['death_date'] = 'zmarli';

    this.getVisibleGraves();
  }

  loadingGrave(user:User){
    if(user.place_name == 'cmentarz' || user.place_name == 'Graveyard')
    {
      this.selectedDeadPosition = (user.position - 1);
      this.isGraveLoadingScreenVisible = true;
    }
  }

  setSceneTime(time:number){
    this.isRandomSceneSelected = false;
    this.selectedSceneTime = time;
  }

  setSceneSeason(season:number){
    this.isRandomSceneSelected = false;
    this.selectedSceneSeason = season;
  }

  randomSceneSelection(){
    this.isRandomSceneSelected = true;
    this.selectedSceneTime = this._global.getRandomNumber(1,2);
    this.selectedSceneSeason = this._global.getRandomNumber(1,4);
  }

  showGraveyard(){
    let scene = this.selectedSceneTime+"_"+this.selectedSceneSeason;
    this.router.navigateByUrl('/graveyard/'+this.selectedDeadPosition+'/'+scene);
  }

  gotoGraveyard(){
    let scene = this._global.getRandomNumber(1,2)+"_"+this._global.getRandomNumber(1,4);
    this.router.navigateByUrl('/graveyard/0/'+scene);
  }

  getGraveWithFirstname(alphabet: string){
    this.selectedDeadPage = 1;
    this.selectedDeadAlphabet = alphabet;
    this.options['position'] = 0;
    this.options['firstname'] = this.selectedDeadAlphabet;
    this.getGraves(this._global.serializeAndURIEncode(this.options));
  }

  getGraveWithPageNumber(pageNumber: number){
    this.selectedDeadPage = pageNumber;
    this.options['position'] = this.selectedDeadPage - 1;
    this.getGraves(this._global.serializeAndURIEncode(this.options));
  }

  showAllGraves(){
    this.selectedDeadPage = 1;
    this.options['position'] = this.selectedDeadPage - 1;
    this.getGraves(this._global.serializeAndURIEncode(this.options));
  }

  getNextPageGraves(){
    if(this.isNavigateNextDeadDisabled)
      return;
    
      this.selectedDeadPage++;
      this.options['position'] = this.selectedDeadPage - 1;
      this.getGraves(this._global.serializeAndURIEncode(this.options));
  }

  getPreviousPageGraves(){
    if(this.isNavigatePreviousDeadDisabled)
      return;

      this.selectedDeadPage--;
      this.options['position'] = this.selectedDeadPage - 1;
      this.getGraves(this._global.serializeAndURIEncode(this.options));
  }

  searchGraveWithFirstname(alphabet: string){
    this.selectedSearchPage = 1;
    this.selectedSearchAlphabet = alphabet;
    this.searchOptions['position'] = 0;
    this.searchOptions['firstname'] = this.selectedSearchAlphabet;
    this.searchGraves(this._global.serializeAndURIEncode(this.searchOptions));
  }

  searchGraveWithPageNumber(pageNumber: number){
    this.selectedSearchPage = pageNumber;
    this.searchOptions['position'] = this.selectedSearchPage - 1;
    this.searchGraves(this._global.serializeAndURIEncode(this.searchOptions));
  }

  searchAllGraves(){
    this.selectedSearchPage = 1;
    this.searchOptions['position'] = this.selectedSearchPage - 1;
    this.searchGraves(this._global.serializeAndURIEncode(this.searchOptions));
  }

  searchNextPageGraves(){
    if(this.isNavigateNextDeadSearchedDisabled)
      return;

    this.selectedSearchPage++;
    this.searchOptions['position'] = this.selectedSearchPage - 1;
    this.searchGraves(this._global.serializeAndURIEncode(this.searchOptions));
  }

  searchPreviousPageGraves(){
    if(this.isNavigatePreviousSearchedDeadDisabled)
      return;
    
    this.selectedSearchPage--;
    this.searchOptions['position'] = this.selectedSearchPage - 1;
    this.searchGraves(this._global.serializeAndURIEncode(this.searchOptions));
  }
  
  submitSearch(){
    if(this.firstname){
      this.searchOptions['firstname'] = this.firstname;
    }

    if(this.surname){
      this.searchOptions['lastname'] = this.surname;
    }

    if(this.dob){
      let dateComponent = this.dob.split('-');
      let validDOB = dateComponent[2]+'-'+dateComponent[1]+'-'+dateComponent[0];
      this.searchOptions['birth_date'] = validDOB;
    }
    
    if(this.dod){
      let dateComponent = this.dod.split('-');
      let validDOD = dateComponent[2]+'-'+dateComponent[1]+'-'+dateComponent[0];
      this.searchOptions['death_date'] = validDOD;
    }

    this.selectedSearchPage = 1;
    this.searchOptions['position'] = this.selectedSearchPage - 1;
    this.isSearchFormVisible = false;
    this.searchGraves(this._global.serializeAndURIEncode(this.searchOptions));
  }

  getPagination(start: number, total: number){
    let pages: number[] = [];
    if(start >= (total - 5)){
      start = (total - 5);
      for(let i = start, j=1; i <= total; i++, j++){
        pages[j-1] = i;
      }
    }
    else{
      for(let i = 0; i <= 3; i++){
        pages[i] = start + i;
      }
      pages[4] = total;
    }

    return pages;
  }

  openTab(name:string) {
    this.selectedTab = name;
    if(name == 'book-of-dead'){
      this.selectedDeadPage = 1;
      this.options['position'] = this.selectedDeadPage - 1;
      this.getGraves(this._global.serializeAndURIEncode(this.options));
    }
    else if(name == 'graveyard-noticeboard'){
      this.getAdvertisements();
    }
  }

  backToSearch(){
    this.isSearchFormVisible = true;
  }

  getAdvertisements(): void {
    this.advertisementService.getAll()
      .subscribe(advertisements => this.advertisements = advertisements);
  }

  updateDeadObject(users: User[], type:string){
    if(this.currentLang == 'en' ){
      let start = (type=="deadlist") ? ((this.selectedDeadPage - 1) * this.datalimit) : ((this.selectedSearchPage - 1) * this.datalimit);
      
      for(let i=0; i<=users.length-1;i++){
        users[i]['position'] = start + (i+1);
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

  getGraves(param: string): void {
    this.loadingData = true;
    this.usersService.getWithMethodAndOptions('browsing', param)
      .subscribe(users => {
        this.loadingData = false;
        this.users = users;
        if(users.length > 0){
          users = this.updateDeadObject(users, 'deadlist');
          this.totalDeads = parseInt(users[0].ilosc);
          this.totalPagesInDeadlist = Math.ceil(this.totalDeads / this.datalimit);
          this.deadlistPages = this.getPagination(this.selectedDeadPage, this.totalPagesInDeadlist);
        }

        if(this.selectedDeadPage == 1){
          this.isNavigatePreviousDeadDisabled = true;
        }
        else{
          this.isNavigatePreviousDeadDisabled = false;
        }
        
        if(this.selectedDeadPage == this.totalPagesInDeadlist){
          this.isNavigateNextDeadDisabled = true;
        }
        else{
          this.isNavigateNextDeadDisabled = false;
        }
      });
  }

  getVisibleGraves(): void {
    this.options['visibility'] = 1;
    this.usersService.getWithMethodAndOptions('browsing', this._global.serializeAndURIEncode(this.options))
      .subscribe(users => {
        delete this.options['visibility'];
        this.prioritizeGraves = users.slice(0,3);
      });
  }

  searchGraves(param: string): void {
    this.searchingData = true;
    this.usersService.getWithMethodAndOptions('browsing', param)
      .subscribe(users => {
        this.searchingData = false;
        this.searchedUsers = users;
        if(users.length > 0){
          users = this.updateDeadObject(users, 'searchlist');
          this.totalSearchedDeads = parseInt(users[0].ilosc);
          this.totalPagesInSearchedDead = Math.ceil(this.totalSearchedDeads / this.datalimit);
          this.searchedDeadPages = this.getPagination(this.selectedSearchPage, this.totalPagesInSearchedDead);
        }

        if(this.selectedSearchPage == 1){
          this.isNavigatePreviousSearchedDeadDisabled = true;
        }
        
        if(this.selectedSearchPage == this.totalPagesInDeadlist){
          this.isNavigateNextDeadSearchedDisabled = true;
        }
        
      });
  }
}
