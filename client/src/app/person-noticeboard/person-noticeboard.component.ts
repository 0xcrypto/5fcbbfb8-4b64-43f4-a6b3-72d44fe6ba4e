import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { Advertisement } from '../classes/advertisement';
import { DataService } from '../services/data.service';
import { User } from '../classes/user';
import { Router } from '@angular/router';
import { AppGlobals } from '../app.globals';
import { CookieStorage, LocalStorage, SessionStorage, LocalStorageService } from 'ngx-store';

export interface Options {
  limit:number;
};

@Component({
  selector: 'app-noticeboard',
  templateUrl: './person-noticeboard.component.html'
})
export class PersonNoticeboardComponent implements OnInit {
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
  selectedSceneTime:number = 1;
  selectedSceneSeason:number = 1;

  /* RESERVATION INFORMATION */
  isReservationTermsVisible:boolean = true;
  currentReservationStep:number = 1;
  totalReservationSteps:number = 7;

  /* GRAVEYARD BURIAL INFORMATION */
  currentBurialStep:number = 1;
  totalBurialSteps:number = 7;
  graveyardBurialSelectedCommunity:string;
  uniqueBurialId:string;
  uniqueReservationId:string;
  uploadedBurialImage:number = 0;
  totalBurialImages:number = 7;
  selectedGraveyardBurialType:string;
  selectedGraveyardBurialSubType:string;
  selectedGraveyardBurialImage:string;
  graveyardBurialFirstname:string;
  graveyardBurialLastname:string;
  graveyardBurialDOB:string;
  graveyardBurialDOD:string;
  graveyardBurialGender:string;
  graveyardBurialInMemoriam:string;
  graveyardBurialSignature:string;
  graveyardBurialSize:number = 0;
  graveyardBurialClanName:string;
  isGraveyardBurialSubTypeVisible:boolean = false;
  graveyardBurialCommunities:any[]=[];
  graveyardBurialImages:any[]=[];
  graveyardBurialEntries:any[]=[];
  
  deadlistPages: number[] = [];
  searchedDeadPages: number[] = [];
  advertisements: Advertisement[] = [];
  users: User[] = [];
  searchedUsers: User[] = [];
  prioritizeGraves: User[] = [];
  grave_stones: any[] = [];
  
  datalimit = 15;
  router:Router = null;
  currentLang:string = null;
  alphabetPages: any[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  /* search form properties */
  firstname:string = null;
  surname:string = null;
  dob:string = null;
  dod:string = null;

  options: Options = null;
  searchOptions: Options = null;
  
  constructor(private _router: Router, 
    private translate: TranslateService, 
    private dataService: DataService, 
    private _global: AppGlobals,
    private localStorageService: LocalStorageService) {
    this.router = _router;
  }

  ngOnInit() {
    this.selectedTab = 'graveyard-noticeboard';
    this.currentLang = this._global.getLanguage();
    this.uniqueReservationId = this.getUniqueCode(50);

    this.getAdvertisements();
    this.getVisibleGraves();

    this.options = this._global.refreshObject(this.options, []);
    this.dataService.getAllWithMethodAndOptions('COMMUNITIES', this._global.serializeAndURIEncode(this.options))
    .subscribe(result => {
      this.graveyardBurialCommunities = result;
    });
    
    if(this.localStorageService.get(this._global.GRAVEYARD_RETURN_TAB) &&
        this.localStorageService.get(this._global.GRAVEYARD_OPTIONS_KEY)){
      
      this.selectedTab = this.localStorageService.get(this._global.GRAVEYARD_RETURN_TAB);
      this.localStorageService.set(this._global.GRAVEYARD_RETURN_TAB, null);
      let parameters = this.localStorageService.get(this._global.GRAVEYARD_OPTIONS_KEY).split('|');
      if(parameters && this.selectedTab == 'book-of-dead'){
        this.loadData(parameters);
      }
      else if(parameters && this.selectedTab == 'search'){
        this.isSearchFormVisible = true;
        this.loadSearchData(parameters);
      }
    }


  }

  loadingGrave(user:User, returnTab:string){
    if(returnTab){
      //Set return tab to be selected when return
      this.localStorageService.set(this._global.GRAVEYARD_RETURN_TAB, returnTab);
    }

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
    this.options = this._global.refreshObject(this.options, ['limit=15', 'position=0', 'order=user_id', 'firstname='+this.selectedDeadAlphabet, 'death_date=zmarli']);
    this.getGraves(this._global.serializeAndURIEncode(this.options));
  }

  getGraveWithPageNumber(pageNumber: number){
    this.selectedDeadPage = pageNumber;
    
    var parameters = ['limit=15', 'position='+ (this.selectedDeadPage - 1),
    'order=user_id', 'death_date=zmarli'];

    if(this.selectedDeadAlphabet)
      parameters.push('firstname='+this.selectedDeadAlphabet);

    this.options = this._global.refreshObject(this.options, parameters);
    
      this.getGraves(this._global.serializeAndURIEncode(this.options));
  }

  showAllGraves(){
    this.selectedDeadPage = 1;
    this.options = this._global.refreshObject(this.options, ['limit=15', 'position='+ (this.selectedDeadPage - 1),
     'order=user_id', 'death_date=zmarli']);
    this.getGraves(this._global.serializeAndURIEncode(this.options));
  }

  getNextPageGraves(){
    if(this.isNavigateNextDeadDisabled)
      return;
    
      this.selectedDeadPage++;
      this.options = this._global.refreshObject(this.options, ['limit=15', 'position='+ (this.selectedDeadPage - 1),
      'order=user_id', 'death_date=zmarli']);
      this.getGraves(this._global.serializeAndURIEncode(this.options));
  }

  getPreviousPageGraves(){
    if(this.isNavigatePreviousDeadDisabled)
      return;

      this.selectedDeadPage--;
      this.options = this._global.refreshObject(this.options, ['limit=15', 'position='+ (this.selectedDeadPage - 1),
      'order=user_id', 'death_date=zmarli']);
      this.getGraves(this._global.serializeAndURIEncode(this.options));
  }

  searchGraveWithFirstname(alphabet: string){
    this.selectedSearchPage = 1;
    this.selectedSearchAlphabet = alphabet;
    this.searchOptions = this._global.refreshObject(this.searchOptions, ['limit=15', 'position=0',
      'order=user_id', 'death_date=zmarli', 'firstname='+this.selectedSearchAlphabet]);
    this.searchGraves(this._global.serializeAndURIEncode(this.searchOptions));
  }

  searchGraveWithPageNumber(pageNumber: number){
    this.selectedSearchPage = pageNumber;
    var parameters = ['limit=15', 'position='+(this.selectedSearchPage - 1),
    'order=user_id', 'death_date=zmarli'];

    if(this.selectedSearchAlphabet)
      parameters.push('firstname='+this.selectedSearchAlphabet);
    
    this.searchOptions = this._global.refreshObject(this.searchOptions, parameters);
    this.searchGraves(this._global.serializeAndURIEncode(this.searchOptions));
  }

  searchAllGraves(){
    this.selectedSearchPage = 1;
    this.searchOptions = this._global.refreshObject(this.searchOptions, ['limit=15', 'position='+(this.selectedSearchPage - 1),
      'order=user_id', 'death_date=zmarli']);
    this.searchGraves(this._global.serializeAndURIEncode(this.searchOptions));
  }

  searchNextPageGraves(){
    if(this.isNavigateNextDeadSearchedDisabled)
      return;

    this.selectedSearchPage++;
    this.searchOptions = this._global.refreshObject(this.searchOptions, ['limit=15', 'position='+(this.selectedSearchPage - 1),
      'order=user_id', 'death_date=zmarli']);
    this.searchGraves(this._global.serializeAndURIEncode(this.searchOptions));
  }

  searchPreviousPageGraves(){
    if(this.isNavigatePreviousSearchedDeadDisabled)
      return;
    
    this.selectedSearchPage--;
    this.searchOptions = this._global.refreshObject(this.searchOptions, ['limit=15', 'position='+(this.selectedSearchPage - 1),
      'order=user_id', 'death_date=zmarli']);
    this.searchGraves(this._global.serializeAndURIEncode(this.searchOptions));
  }
  
  submitSearch(){
    //, 'death_date=zmarli'
    var parameters = ['limit=15', 'order=user_id']
    if(this.firstname){
      parameters.push('firstname='+this.firstname);
    }

    if(this.surname){
      parameters.push('lastname='+this.surname);
    }

    if(this.dob){
      let dateComponent = this.dob.split('-');
      let validDOB = dateComponent[2]+'-'+dateComponent[1]+'-'+dateComponent[0];
      parameters.push('birth_date='+validDOB);
    }
    
    if(this.dod){
      let dateComponent = this.dod.split('-');
      let validDOD = dateComponent[2]+'-'+dateComponent[1]+'-'+dateComponent[0];
      parameters.push('death_date='+validDOD);
    }

    this.loadSearchData(parameters);
  }

  loadSearchData(parameters:string[]){
    this.selectedSearchPage = 1;
    parameters.push('position='+(this.selectedSearchPage - 1));
    this.localStorageService.set(this._global.GRAVEYARD_OPTIONS_KEY, parameters.join('|'));
    this.searchOptions = this._global.refreshObject(this.searchOptions, parameters);
    this.searchGraves(this._global.serializeAndURIEncode(this.searchOptions));
  }

  openTab(name:string) {
    this.selectedTab = name;
    if(this.selectedTab == 'graveyard-noticeboard'){
      this.getAdvertisements();
      this.getVisibleGraves();
    }

    if(this.selectedTab == 'book-of-dead'){
      this.selectedDeadPage = 1;
      let parameters = ['limit=15', 'position='+ (this.selectedDeadPage - 1),
      'order=user_id', 'death_date=zmarli'];
      this.loadData(parameters);
    }

    if(this.selectedTab == 'graveyard-burial'){
      this.isGraveyardBurialSubTypeVisible = false;
      this.uniqueBurialId = this.getUniqueCode(50);
      this.graveyardBurialImages = [];
      this.uploadedBurialImage = 0;
    }
  }

  loadData(parameters:string[]){
    this.options = this._global.refreshObject(this.options, parameters);
    this.localStorageService.set(this._global.GRAVEYARD_OPTIONS_KEY, parameters.join('|'));
    this.getGraves(this._global.serializeAndURIEncode(this.options));
  }
  
  backToSearch(){
    this.isSearchFormVisible = true;
  }

  goToCatacomb(){
    this.router.navigateByUrl('/catacomb');
  }

  getAdvertisements(): void {
    this.options = this._global.refreshObject(this.options, ['limit=3']);
    this.dataService.getAllWithMethodAndOptions('ADVERTISEMENTS', this._global.serializeAndURIEncode(this.options))
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
    this.dataService.getAllWithMethodAndOptions('PERSONS', param)
      .subscribe(users => {
        this.loadingData = false;
        this.users = users;
        if(users.length > 0){
          users = this.updateDeadObject(users, 'deadlist');
          this.totalDeads = parseInt(users[0].ilosc);
          this.totalPagesInDeadlist = Math.ceil(this.totalDeads / this.datalimit);
          this.deadlistPages = this._global.getPagination(this.selectedDeadPage, this.totalPagesInDeadlist);
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
    this.options = this._global.refreshObject(this.options, ['limit=3', 'position=0', 'order=user_id', 'death_date=zmarli', 'visibility=1']);
    this.dataService.getAllWithMethodAndOptions('PERSONS', this._global.serializeAndURIEncode(this.options))
      .subscribe(users => {
        delete this.options['visibility'];
        this.prioritizeGraves = users.slice(0,3);
      });
  }

  searchGraves(param: string): void {
    this.isSearchFormVisible = false;
    this.searchingData = true;
    this.dataService.getAllWithMethodAndOptions('PERSONS', param)
      .subscribe(users => {
        this.searchingData = false;
        this.searchedUsers = users;
        if(users.length > 0){
          users = this.updateDeadObject(users, 'searchlist');
          this.totalSearchedDeads = parseInt(users[0].ilosc);
          this.totalPagesInSearchedDead = Math.ceil(this.totalSearchedDeads / this.datalimit);
          this.searchedDeadPages = this._global.getPagination(this.selectedSearchPage, this.totalPagesInSearchedDead);
        }

        if(this.selectedSearchPage == 1){
          this.isNavigatePreviousSearchedDeadDisabled = true;
        }
        
        if(this.selectedSearchPage == this.totalPagesInDeadlist){
          this.isNavigateNextDeadSearchedDisabled = true;
        }
        
      });
  }
  burialPrevStep(){
    this.currentBurialStep--;
  }
  burialNextStep(){
    this.currentBurialStep++;

    if(this.currentBurialStep == 2){
      if(this.selectedGraveyardBurialType == 'graveyard'){
        if(this.selectedGraveyardBurialSubType == 'single'){
          this.graveyardBurialSize = 1;
          this.options = this._global.refreshObject(this.options, ['grave_type=Graveyard_Single', 'community=Atheistic']);
          this.dataService.getAllWithMethodAndOptions('PERSON_GRAVE_TILE_IMAGES', this._global.serializeAndURIEncode(this.options))
          .subscribe(result => {
            this.grave_stones = result;
      
            for(var i=0; i<=this.grave_stones.length-1; i++){
              this.grave_stones[i].data = this.grave_stones[i].grave;
              this.grave_stones[i].min = './assets/images/graves/mini/'+ this.grave_stones[i].grave+'.jpg';
              this.grave_stones[i].max = './assets/images/graves/maxi/'+ this.grave_stones[i].grave+'.jpg';
            }
          });
        }
        else if(this.selectedGraveyardBurialSubType == 'family'){
          this.graveyardBurialSize = 2;
          this.options = this._global.refreshObject(this.options, ['grave_type=Graveyard_Family']);
          this.dataService.getAllWithMethodAndOptions('PERSON_GRAVE_TILE_IMAGES', this._global.serializeAndURIEncode(this.options))
          .subscribe(result => {
            this.grave_stones = result;
      
            for(var i=0; i<=this.grave_stones.length-1; i++){
              this.grave_stones[i].data = this.grave_stones[i].grave;
              this.grave_stones[i].min = './assets/images/graves/mini/'+ this.grave_stones[i].grave+'.jpg';
              this.grave_stones[i].max = './assets/images/graves/maxi/'+ this.grave_stones[i].grave+'.jpg';
            }
          });
        }
        else if(this.selectedGraveyardBurialSubType == 'communal'){
          this.options = this._global.refreshObject(this.options, ['grave_type=Graveyard_Communal']);
          this.dataService.getAllWithMethodAndOptions('PERSON_GRAVE_TILE_IMAGES', this._global.serializeAndURIEncode(this.options))
          .subscribe(result => {
            this.grave_stones = result;
      
            for(var i=0; i<=this.grave_stones.length-1; i++){
              this.grave_stones[i].data = this.grave_stones[i].grave;
              this.grave_stones[i].min = './assets/images/graves/mini/'+ this.grave_stones[i].grave+'.jpg';
              this.grave_stones[i].max = './assets/images/graves/maxi/'+ this.grave_stones[i].grave+'.jpg';
            }
          });
        }
      }
      else if(this.selectedGraveyardBurialType == 'catacomb'){
        this.graveyardBurialSize = 1;
        this.options = this._global.refreshObject(this.options, ['grave_type=Catacombs']);
        this.dataService.getAllWithMethodAndOptions('PERSON_GRAVE_TILE_IMAGES', this._global.serializeAndURIEncode(this.options))
        .subscribe(result => {
          this.grave_stones = result;
    
          for(var i=0; i<=this.grave_stones.length-1; i++){
            this.grave_stones[i].data = this.grave_stones[i].grave;
            this.grave_stones[i].min = './assets/images/graves/katak_mini/'+ this.grave_stones[i].grave+'.jpg';
            this.grave_stones[i].max = './assets/images/graves/katak_maxi/'+ this.grave_stones[i].grave+'.jpg';
          }
        });
      }
    }
    if(this.currentBurialStep == 5){
      //'type': this.selectedGraveyardBurialType,
      //'sub_type': this.selectedGraveyardBurialSubType,
      if (this.graveyardBurialEntries.some((p) => p.firstname == this.graveyardBurialFirstname))
        return; 
      
      let entry = {
        'firstname': this.graveyardBurialFirstname,
        'lastname': this.graveyardBurialLastname,
        'dob': this.graveyardBurialDOB,
        'dod': this.graveyardBurialDOD,
        'gender': this.graveyardBurialGender,
        'in_memoriam': this.graveyardBurialInMemoriam,
        'signature': this.graveyardBurialSignature,
        'images': this.graveyardBurialImages
      }
      this.graveyardBurialEntries.push(entry);
      this.graveyardBurialImages = [];
      
    }
  }
  addAnotherPersonInGraveyardBurial(){
    this.graveyardBurialFirstname = null;
    this.graveyardBurialLastname = null;
    this.graveyardBurialDOB = null;
    this.graveyardBurialDOD = null;
    this.graveyardBurialGender = null;
    this.graveyardBurialInMemoriam = null;
    this.graveyardBurialSignature = null;
    this.graveyardBurialImages = [];
    this.currentBurialStep = 3;
  }
  changeGraveyardBurialPerson(person:any){
    this.graveyardBurialFirstname = person.firstname;
    this.graveyardBurialLastname = person.lastname;
    this.graveyardBurialDOB = person.dob;
    this.graveyardBurialDOD = person.dod;
    this.graveyardBurialGender = person.gender;
    this.graveyardBurialInMemoriam = person.in_memoriam;
    this.graveyardBurialSignature = person.signature;
    this.graveyardBurialImages = person.images;
    this.currentBurialStep = 3;
  }
  removeGraveyardBurialPerson(person:any){
    this.graveyardBurialEntries = this.graveyardBurialEntries
      .filter(p => p.firstname !== person.firstname);
    if(this.graveyardBurialEntries.length == 0){
      this.currentBurialStep = 3;
    }
  }
  acceptReservationTerms(){
    this.isReservationTermsVisible = false;
  }
  rejectReservationTerms(){
    this.isReservationTermsVisible = true;
  }
  reservationPrevStep(){
    this.currentReservationStep--;
  }
  reservationNextStep(){
    this.currentReservationStep++;
  }
  selectCommunity(){
    this.options = this._global.refreshObject(this.options, ['community='+this.graveyardBurialSelectedCommunity, 'grave_type=Graveyard_Single']);
    this.dataService.getAllWithMethodAndOptions('PERSON_GRAVE_TILE_IMAGES', this._global.serializeAndURIEncode(this.options))
    .subscribe(result => {
      this.grave_stones = result;

      for(var i=0; i<=this.grave_stones.length-1; i++){
        this.grave_stones[i].data = this.grave_stones[i].grave;
        this.grave_stones[i].min = './assets/images/graves/mini/'+ this.grave_stones[i].grave+'.jpg';
        this.grave_stones[i].max = './assets/images/graves/maxi/'+ this.grave_stones[i].grave+'.jpg';
      }
    });
  }
  uploadBurialPhotos(fileList:any){
    if(this.uploadedBurialImage == this.totalBurialImages)
      return;
    
    let headers = new HttpHeaders();
    headers.set('Content-Type', null);
    headers.set('Accept', "multipart/form-data");
    const formData = new FormData();
    formData.append('file', fileList[0]);
    formData.append('unique_id',this.uniqueBurialId);
    formData.append('method', 'ADD_PERSON_TEMP_PHOTO');
    if(this.uploadedBurialImage == 0){
      formData.append('is_portrait', '1');
    }
      
    this.dataService.uploadWithMethodAndOptions(formData, headers)
      .subscribe(result => {
        this.uploadedBurialImage++;
        this.options = this._global.refreshObject(this.options, ['unique_id='+this.uniqueBurialId]);
        this.dataService.getAllWithMethodAndOptions('PERSON_TEMP_PHOTOS', this._global.serializeAndURIEncode(this.options))
        .subscribe(result => {
          this.graveyardBurialImages = result;
          for(let i=0;i<this.graveyardBurialImages.length;i++) {
            this.graveyardBurialImages[i].is_portrait = (parseInt(this.graveyardBurialImages[i].is_portrait) == 1) ? true : false;
            this.graveyardBurialImages[i].url = './assets/images/zdjecia/large/'+this.graveyardBurialImages[i].file_name;
          }
        });
    });
  }
  changeGraveyardBurialType(){
    if(this.selectedGraveyardBurialType == 'graveyard'){
      this.isGraveyardBurialSubTypeVisible = true;
    }
    else{
      this.isGraveyardBurialSubTypeVisible = false;
    }
  }
  selectGraveImage(data:any){
    this.selectedGraveyardBurialImage = data;
  }
  getUniqueCode(length){
    var a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
    var b = [];  
    for (var i=0; i<length; i++) {
        var j = (Math.random() * (a.length-1)).toFixed(0);
        b[i] = a[j];
    }
    return b.join("");
  }
}

