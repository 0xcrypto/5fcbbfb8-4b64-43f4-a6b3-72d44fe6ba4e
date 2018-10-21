import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { Advertisement } from '../classes/advertisement';
import { DataService } from '../services/data.service';
import { MessageService } from '../services/message.service';
import { ImageService } from '../services/image.service';
import { UserService } from '../services/user.service';
import { User } from '../classes/user';
import { Router } from '@angular/router';
import { AppGlobals } from '../app.globals';
import { CookieStorage, LocalStorage, SessionStorage, LocalStorageService } from 'ngx-store';
import { debug } from 'ngx-store/src/config';

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
  reservationCurrentStep:number = 1;
  reservationTotalSteps:number = 7;
  reservationSelectedCommunity:string;
  reservationUniqueId:string;
  reservationUploadedImages:number = 0;
  reservationTotalImages:number = 7;
  reservationSelectedType:string;
  reservationSelectedSubType:string;
  reservationSelectedStone:string;
  reservationFirstname:string;
  reservationLastname:string;
  reservationDOB:string;
  reservationDOD:string;
  reservationGender:string;
  reservationInMemoriam:string;
  reservationSignature:string;
  reservationSize:number = 0;
  reservationClanName:string;
  isReservationSubTypeVisible:boolean = false;
  reservationFee:number;
  reservationCurrency:string="EUR";
  reservationCommunities:any[]=[];
  reservationImages:any[]=[];
  reservationPersons:any[]=[];
  reservationStones: any[] = [];
  reservationReligions: any[] = [];
  reservationSelectedReligion: string;
  reservationData:any;

  /* GRAVEYARD BURIAL INFORMATION */
  graveyardBurialCurrentStep:number = 1;
  graveyardBurialTotalSteps:number = 7;
  graveyardBurialSelectedCommunity:string;
  graveyardBurialUniqueId:string;
  graveyardBurialUploadedImages:number = 0;
  graveyardBurialTotalImages:number = 7;
  graveyardBurialSelectedType:string;
  graveyardBurialSelectedSubType:string;
  graveyardBurialSelectedStoneId:string;
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
  graveyardBurialFee:number;
  graveyardBurialCurrency:string="EUR";
  graveyardBurialCommunities:any[]=[];
  graveyardBurialImages:any[]=[];
  graveyardBurialPersons:any[]=[];
  graveyardBurialStones: any[] = [];
  graveyardBurialData:any;
  graveyardBurialReligions: any[] = [];
  graveyardBurialSelectedReligion: string;
  
  deadlistPages: number[] = [];
  searchedDeadPages: number[] = [];
  advertisements: Advertisement[] = [];
  users: User[] = [];
  searchedUsers: User[] = [];
  prioritizeGraves: User[] = [];
  gravePrice: number;
  USER_INFO:any = null;
  
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
    private localStorageService: LocalStorageService,
    private imageService:ImageService,
    private messageService:MessageService,  
    private userService:UserService ) {
    this.router = _router;
  }

  ngOnInit() {
    if(this.imageService.cachedImages.length == 0)
      this.router.navigateByUrl('/home');

    this.selectedTab = 'graveyard-noticeboard';
    this.currentLang = this._global.getLanguage();

    this.userService.castUser.subscribe(user => this.USER_INFO = user);

    this.getAdvertisements();
    this.getVisibleGraves();

    this.options = this._global.refreshObject(this.options, []);
    this.dataService.getAllWithMethodAndOptions('COMMUNITIES', this._global.serializeAndURIEncode(this.options))
    .subscribe(result => {
      this.graveyardBurialCommunities = this.reservationCommunities= result;
    });

    this.dataService.getAllWithMethodAndOptions('RELIGIONS', this._global.serializeAndURIEncode(this.options))
    .subscribe(result => {
      this.graveyardBurialReligions = this.reservationReligions = result;
    });
    
    this.options = this._global.refreshObject(this.options, ['type=grave']);
    this.dataService.getAllWithMethodAndOptions('PRICES', this._global.serializeAndURIEncode(this.options))
      .subscribe(data => {
        this.gravePrice = parseFloat(data[0].price);
      }
    );

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
    this.messageService.castMessage.subscribe(object => {
      
    });

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
      this.graveyardBurialUniqueId = this.getUniqueCode(50);
      this.graveyardBurialImages = [];
      this.graveyardBurialUploadedImages = 0;
    }

    if(this.selectedTab == 'reservation'){
      this.isReservationSubTypeVisible = false;
      this.reservationUniqueId = this.getUniqueCode(50);
      this.reservationImages = [];
      this.reservationUploadedImages = 0;
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

  /* GRAVE BURIAL */
  graveyardBurialPreviousStep(){
    this.graveyardBurialCurrentStep--;
  }

  graveyardBurialNextStep(){
    if(this.graveyardBurialCurrentStep == 1){
      if(this.graveyardBurialSelectedType == 'graveyard'){
        if(this.graveyardBurialSelectedSubType == 'single'){
          this.graveyardBurialSize = 1;
          this.options = this._global.refreshObject(this.options, ['grave_type=Graveyard_Single', 'community=Atheistic']);
          this.dataService.getAllWithMethodAndOptions('PERSON_GRAVE_TILE_IMAGES', this._global.serializeAndURIEncode(this.options))
          .subscribe(result => {
            this.graveyardBurialStones = result;
      
            for(var i=0; i<=this.graveyardBurialStones.length-1; i++){
              this.graveyardBurialStones[i].data = this.graveyardBurialStones[i].grave;
              this.graveyardBurialStones[i].min = './assets/images/graves/mini/'+ this.graveyardBurialStones[i].grave+'.jpg';
              this.graveyardBurialStones[i].max = './assets/images/graves/maxi/'+ this.graveyardBurialStones[i].grave+'.jpg';
            }
          });
        }
        else if(this.graveyardBurialSelectedSubType == 'family'){
          this.graveyardBurialSize = 2;
          this.options = this._global.refreshObject(this.options, ['grave_type=Graveyard_Family']);
          this.dataService.getAllWithMethodAndOptions('PERSON_GRAVE_TILE_IMAGES', this._global.serializeAndURIEncode(this.options))
          .subscribe(result => {
            this.graveyardBurialStones = result;
      
            for(var i=0; i<=this.graveyardBurialStones.length-1; i++){
              this.graveyardBurialStones[i].data = this.graveyardBurialStones[i].grave;
              this.graveyardBurialStones[i].min = './assets/images/graves/mini/'+ this.graveyardBurialStones[i].grave+'.jpg';
              this.graveyardBurialStones[i].max = './assets/images/graves/maxi/'+ this.graveyardBurialStones[i].grave+'.jpg';
            }
          });
        }
        else if(this.graveyardBurialSelectedSubType == 'communal'){
          this.options = this._global.refreshObject(this.options, ['grave_type=Graveyard_Communal']);
          this.dataService.getAllWithMethodAndOptions('PERSON_GRAVE_TILE_IMAGES', this._global.serializeAndURIEncode(this.options))
          .subscribe(result => {
            this.graveyardBurialStones = result;
      
            for(var i=0; i<=this.graveyardBurialStones.length-1; i++){
              this.graveyardBurialStones[i].data = this.graveyardBurialStones[i].grave;
              this.graveyardBurialStones[i].min = './assets/images/graves/mini/'+ this.graveyardBurialStones[i].grave+'.jpg';
              this.graveyardBurialStones[i].max = './assets/images/graves/maxi/'+ this.graveyardBurialStones[i].grave+'.jpg';
            }
          });
        }
        else{
          this.messageService.sendMessage('OPEN_CUSTOM_DIALOG', {'data': 'PLEASE_SELECT_PERSON_BURIAL_SUB_TYPE' });
          return;
        }
      }
      else if(this.graveyardBurialSelectedType == 'catacomb'){
        this.graveyardBurialSize = 1;
        this.options = this._global.refreshObject(this.options, ['grave_type=Catacombs']);
        this.dataService.getAllWithMethodAndOptions('PERSON_GRAVE_TILE_IMAGES', this._global.serializeAndURIEncode(this.options))
        .subscribe(result => {
          this.graveyardBurialStones = result;
    
          for(var i=0; i<=this.graveyardBurialStones.length-1; i++){
            this.graveyardBurialStones[i].data = this.graveyardBurialStones[i].grave;
            this.graveyardBurialStones[i].min = './assets/images/graves/katak_mini/'+ this.graveyardBurialStones[i].grave+'.jpg';
            this.graveyardBurialStones[i].max = './assets/images/graves/katak_maxi/'+ this.graveyardBurialStones[i].grave+'.jpg';
          }
        });
      }
      else{
        this.messageService.sendMessage('OPEN_CUSTOM_DIALOG', {'data': 'PLEASE_SELECT_PERSON_BURIAL_TYPE' });
        return;
      }
    }

    if(this.graveyardBurialCurrentStep == 2){
      if(this.graveyardBurialSelectedStoneId == null){
        this.messageService.sendMessage('OPEN_CUSTOM_DIALOG', {'data': 'SELECT_GRAVE_STONE' });
        return;
      }
    }

    if(this.graveyardBurialCurrentStep == 3){
      if(this.graveyardBurialFirstname == null){
        this.messageService.sendMessage('OPEN_CUSTOM_DIALOG', {'data': 'PLEASE_PROVIDE_FIRSTNAME' });
        return;
      }
      if(this.graveyardBurialLastname == null){
        this.messageService.sendMessage('OPEN_CUSTOM_DIALOG', {'data': 'PLEASE_PROVIDE_LASTNAME' });
        return;
      }
      if(this.graveyardBurialDOB == null){
        this.messageService.sendMessage('OPEN_CUSTOM_DIALOG', {'data': 'PLEASE_PROVIDE_DOB' });
        return;
      }
      if(this.graveyardBurialDOD == null){
        this.messageService.sendMessage('OPEN_CUSTOM_DIALOG', {'data': 'PLEASE_PROVIDE_DOD' });
        return;
      }
      if(this.graveyardBurialGender == null){
        this.messageService.sendMessage('OPEN_CUSTOM_DIALOG', {'data': 'PLEASE_PROVIDE_GENDER' });
        return;
      }
      if (this.graveyardBurialPersons.some((p) => (p.firstname+p.lastname) == this.graveyardBurialFirstname+this.graveyardBurialLastname)){
        this.messageService.sendMessage('OPEN_CUSTOM_DIALOG', {'data': 'PERSON_ALREADY_EXISTS' });
        return;
      }
    
      let entry = {
        'firstname': this.graveyardBurialFirstname,
        'lastname': this.graveyardBurialLastname,
        'dob': this.graveyardBurialDOB,
        'dod': this.graveyardBurialDOD,
        'gender': this.graveyardBurialGender,
        'in_memoriam': this.graveyardBurialInMemoriam,
        'signature': this.graveyardBurialSignature
      }
      this.graveyardBurialPersons.push(entry);
    }

    if(this.graveyardBurialCurrentStep == 6){
      this.graveyardBurialFee = this.graveyardBurialPersons.length * 24;
    }
    
    if(this.graveyardBurialCurrentStep == 7){
      let place_id = 0;
      let grave_id = 0;
      
      if(this.graveyardBurialSelectedType == 'graveyard'){
        place_id = 1;

        if(this.graveyardBurialSelectedSubType == 'single'){
          grave_id = 1;
        }
        else if(this.graveyardBurialSelectedSubType == 'family'){
          grave_id = 1;
        }
        else if(this.graveyardBurialSelectedSubType == 'single'){
          grave_id = 1;
        }
      }
      else if(this.graveyardBurialSelectedType == 'catacomb'){
        place_id = 3;
        grave_id = 1;
      }

      let payment_method = 1;
      let payment_id = 12345;
      
      for(let i=0; i<=this.graveyardBurialPersons.length-1;i++) {
        this.options = this._global.refreshObject(this.options, ['method=ADD_PERSON', 'temp=0',
        'religion_id='+this.graveyardBurialSelectedReligion, 'payment_method='+payment_method, 
        'payment_id='+payment_id, 'amount='+this.gravePrice, 'current_language='+this.currentLang,
        'date_birth='+this.graveyardBurialPersons[i].dob, 'date_death='+this.graveyardBurialPersons[i].dod,
        'buyer_id='+this.USER_INFO.buyer_id, 'place_id='+place_id, 'grave_id='+grave_id,
        'name='+this.graveyardBurialPersons[i].firstname, 'surname='+this.graveyardBurialPersons[i].lastname,
        'gender='+this.graveyardBurialPersons[i].gender, 'grave_image='+this.graveyardBurialSelectedStoneId,
        'bio_title='+this.graveyardBurialPersons[i].signature, 'in_memoriam='+this.graveyardBurialPersons[i].in_memoriam
        ]);
        this.dataService.createWithMethodAndOptions(this.options)
        .subscribe(result => {
          
        });
      }
      //'images': this.graveyardBurialImages,
      console.log(this.graveyardBurialData);
    }

    this.graveyardBurialCurrentStep++;
  }

  changeGraveyardBurialType(){
    if(this.graveyardBurialSelectedType == 'graveyard'){
      this.isGraveyardBurialSubTypeVisible = true;
    }
    else{
      this.isGraveyardBurialSubTypeVisible = false;
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
    this.graveyardBurialCurrentStep = 3;
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
    this.graveyardBurialCurrentStep = 3;
  }

  removeGraveyardBurialPerson(person:any){
    this.graveyardBurialPersons = this.graveyardBurialPersons
      .filter(p => p.firstname !== person.firstname);
    if(this.graveyardBurialPersons.length == 0){
      this.graveyardBurialCurrentStep = 3;
    }
  }

  selectGraveyardBurialCommunity(){
    this.options = this._global.refreshObject(this.options, ['community='+this.graveyardBurialSelectedCommunity, 'grave_type=Graveyard_Single']);
    this.dataService.getAllWithMethodAndOptions('PERSON_GRAVE_TILE_IMAGES', this._global.serializeAndURIEncode(this.options))
    .subscribe(result => {
      this.graveyardBurialStones = result;

      for(var i=0; i<=this.graveyardBurialStones.length-1; i++){
        this.graveyardBurialStones[i].data = this.graveyardBurialStones[i].grave;
        this.graveyardBurialStones[i].min = './assets/images/graves/mini/'+ this.graveyardBurialStones[i].grave+'.jpg';
        this.graveyardBurialStones[i].max = './assets/images/graves/maxi/'+ this.graveyardBurialStones[i].grave+'.jpg';
      }
    });
  }

  uploadGraveyardBurialPhotos(fileList:any){
    if(this.graveyardBurialUploadedImages == this.graveyardBurialTotalImages)
      return;
    
    let headers = new HttpHeaders();
    headers.set('Content-Type', null);
    headers.set('Accept', "multipart/form-data");
    const formData = new FormData();
    formData.append('file', fileList[0]);
    formData.append('unique_id',this.graveyardBurialUniqueId);
    formData.append('method', 'ADD_PERSON_TEMP_PHOTO');
    if(this.graveyardBurialUploadedImages == 0){
      formData.append('is_portrait', '1');
    }
      
    this.dataService.uploadWithMethodAndOptions(formData, headers)
      .subscribe(result => {
        this.graveyardBurialUploadedImages++;
        this.options = this._global.refreshObject(this.options, ['unique_id='+this.graveyardBurialUniqueId]);
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

  selectGraveyardBurialStone(data:any){debugger;
    this.graveyardBurialSelectedStoneId = data.substring(data.lastIndexOf('_')+1, data.length);
  }

  /* RESERVATION */
  acceptReservationTerms(){
    this.isReservationTermsVisible = false;
  }

  rejectReservationTerms(){
    this.isReservationTermsVisible = true;
  }

  reservationPreviousStep(){
    this.reservationCurrentStep--;
  }

  reservationNextStep(){
    if(this.reservationCurrentStep == 1){
      if(this.reservationSelectedType == 'graveyard'){
        if(this.reservationSelectedSubType == 'single'){
          this.reservationSize = 1;
          this.options = this._global.refreshObject(this.options, ['grave_type=Graveyard_Single', 'community=Atheistic']);
          this.dataService.getAllWithMethodAndOptions('PERSON_GRAVE_TILE_IMAGES', this._global.serializeAndURIEncode(this.options))
          .subscribe(result => {
            this.reservationStones = result;
      
            for(var i=0; i<=this.reservationStones.length-1; i++){
              this.reservationStones[i].data = this.reservationStones[i].grave;
              this.reservationStones[i].min = './assets/images/graves/mini/'+ this.reservationStones[i].grave+'.jpg';
              this.reservationStones[i].max = './assets/images/graves/maxi/'+ this.reservationStones[i].grave+'.jpg';
            }
          });
        }
        else if(this.reservationSelectedSubType == 'family'){
          this.reservationSize = 2;
          this.options = this._global.refreshObject(this.options, ['grave_type=Graveyard_Family']);
          this.dataService.getAllWithMethodAndOptions('PERSON_GRAVE_TILE_IMAGES', this._global.serializeAndURIEncode(this.options))
          .subscribe(result => {
            this.reservationStones = result;
      
            for(var i=0; i<=this.reservationStones.length-1; i++){
              this.reservationStones[i].data = this.reservationStones[i].grave;
              this.reservationStones[i].min = './assets/images/graves/mini/'+ this.reservationStones[i].grave+'.jpg';
              this.reservationStones[i].max = './assets/images/graves/maxi/'+ this.reservationStones[i].grave+'.jpg';
            }
          });
        }
        else if(this.reservationSelectedSubType == 'communal'){
          this.options = this._global.refreshObject(this.options, ['grave_type=Graveyard_Communal']);
          this.dataService.getAllWithMethodAndOptions('PERSON_GRAVE_TILE_IMAGES', this._global.serializeAndURIEncode(this.options))
          .subscribe(result => {
            this.reservationStones = result;
      
            for(var i=0; i<=this.reservationStones.length-1; i++){
              this.reservationStones[i].data = this.reservationStones[i].grave;
              this.reservationStones[i].min = './assets/images/graves/mini/'+ this.reservationStones[i].grave+'.jpg';
              this.reservationStones[i].max = './assets/images/graves/maxi/'+ this.reservationStones[i].grave+'.jpg';
            }
          });
        }
        else{
          this.messageService.sendMessage('OPEN_CUSTOM_DIALOG', {'data': 'PLEASE_SELECT_PERSON_BURIAL_SUB_TYPE' });
          return;
        }
      }
      else if(this.reservationSelectedSubType == 'catacomb'){
        this.reservationSize = 1;
        this.options = this._global.refreshObject(this.options, ['grave_type=Catacombs']);
        this.dataService.getAllWithMethodAndOptions('PERSON_GRAVE_TILE_IMAGES', this._global.serializeAndURIEncode(this.options))
        .subscribe(result => {
          this.reservationStones = result;
    
          for(var i=0; i<=this.reservationStones.length-1; i++){
            this.reservationStones[i].data = this.reservationStones[i].grave;
            this.reservationStones[i].min = './assets/images/graves/katak_mini/'+ this.reservationStones[i].grave+'.jpg';
            this.reservationStones[i].max = './assets/images/graves/katak_maxi/'+ this.reservationStones[i].grave+'.jpg';
          }
        });
      }
      else{
        this.messageService.sendMessage('OPEN_CUSTOM_DIALOG', {'data': 'PLEASE_SELECT_PERSON_BURIAL_TYPE' });
        return;
      }
    }

    if(this.reservationCurrentStep == 2){
      if(this.reservationSelectedStone == null){
        this.messageService.sendMessage('OPEN_CUSTOM_DIALOG', {'data': 'SELECT_GRAVE_STONE' });
        return;
      }
    }

    if(this.reservationCurrentStep == 3){
      if(this.reservationFirstname == null){
        this.messageService.sendMessage('OPEN_CUSTOM_DIALOG', {'data': 'PLEASE_PROVIDE_FIRSTNAME' });
        return;
      }
      if(this.reservationLastname == null){
        this.messageService.sendMessage('OPEN_CUSTOM_DIALOG', {'data': 'PLEASE_PROVIDE_LASTNAME' });
        return;
      }
      if(this.reservationDOB == null){
        this.messageService.sendMessage('OPEN_CUSTOM_DIALOG', {'data': 'PLEASE_PROVIDE_DOB' });
        return;
      }
      if(this.reservationDOD == null){
        this.messageService.sendMessage('OPEN_CUSTOM_DIALOG', {'data': 'PLEASE_PROVIDE_DOD' });
        return;
      }
      if(this.reservationGender == null){
        this.messageService.sendMessage('OPEN_CUSTOM_DIALOG', {'data': 'PLEASE_PROVIDE_GENDER' });
        return;
      }

      if (this.reservationPersons.some((p) => (p.firstname+p.lastname) == this.reservationFirstname+this.reservationLastname)){
        this.messageService.sendMessage('OPEN_CUSTOM_DIALOG', {'data': 'PERSON_ALREADY_EXISTS' });
        return;
      }
    
      let entry = {
        'firstname': this.reservationFirstname,
        'lastname': this.reservationLastname,
        'dob': this.reservationDOB,
        'dod': this.reservationDOD,
        'gender': this.reservationGender,
        'in_memoriam': this.reservationInMemoriam,
        'signature': this.reservationSignature
      }
      this.reservationPersons.push(entry);
    }

    if(this.reservationCurrentStep == 6){
      this.reservationFee = this.reservationPersons.length * 24;
    }
    
    if(this.reservationCurrentStep == 7){
      this.reservationData = {
        'type': this.reservationSelectedType,
        'sub_type': this.reservationSelectedSubType,
        'stone': this.reservationSelectedStone,
        'images': this.reservationImages,
        'persons': this.reservationPersons
      };

      console.log(this.reservationData);
    }

    this.reservationCurrentStep++;
  }
  
  changeReservationType(){
    if(this.reservationSelectedType == 'graveyard'){
      this.isReservationSubTypeVisible = true;
    }
    else{
      this.isReservationSubTypeVisible = false;
    }
  }

  addAnotherPersonInReservation(){
    this.reservationFirstname = null;
    this.reservationLastname = null;
    this.reservationDOB = null;
    this.reservationDOD = null;
    this.reservationGender = null;
    this.reservationInMemoriam = null;
    this.reservationSignature = null;
    this.reservationImages = [];
    this.reservationCurrentStep = 3;
  }

  changeReservationPerson(person:any){
    this.reservationFirstname = person.firstname;
    this.reservationLastname = person.lastname;
    this.reservationDOB = person.dob;
    this.reservationDOD = person.dod;
    this.reservationGender = person.gender;
    this.reservationInMemoriam = person.in_memoriam;
    this.reservationSignature = person.signature;
    this.reservationImages = person.images;
    this.reservationCurrentStep = 3;
  }

  removeReservationPerson(person:any){
    this.reservationPersons = this.reservationPersons.filter(p => p.firstname !== person.firstname);

    if(this.reservationPersons.length == 0){
      this.reservationCurrentStep = 3;
    }
  }

  selectReservationCommunity(){
    this.options = this._global.refreshObject(this.options, ['community='+this.reservationSelectedCommunity, 'grave_type=Graveyard_Single']);
    this.dataService.getAllWithMethodAndOptions('PERSON_GRAVE_TILE_IMAGES', this._global.serializeAndURIEncode(this.options))
    .subscribe(result => {
      this.reservationStones = result;

      for(var i=0; i<=this.reservationStones.length-1; i++){
        this.reservationStones[i].data = this.reservationStones[i].grave;
        this.reservationStones[i].min = './assets/images/graves/mini/'+ this.reservationStones[i].grave+'.jpg';
        this.reservationStones[i].max = './assets/images/graves/maxi/'+ this.reservationStones[i].grave+'.jpg';
      }
    });
  }

  uploadReservationPhotos(fileList:any){
    if(this.reservationUploadedImages == this.reservationTotalImages)
      return;
    
    let headers = new HttpHeaders();
    headers.set('Content-Type', null);
    headers.set('Accept', "multipart/form-data");
    const formData = new FormData();
    formData.append('file', fileList[0]);
    formData.append('unique_id',this.reservationUniqueId);
    formData.append('method', 'ADD_PERSON_TEMP_PHOTO');
    if(this.reservationUploadedImages == 0){
      formData.append('is_portrait', '1');
    }
      
    this.dataService.uploadWithMethodAndOptions(formData, headers)
      .subscribe(result => {
        this.reservationUploadedImages++;
        this.options = this._global.refreshObject(this.options, ['unique_id='+this.reservationUniqueId]);
        this.dataService.getAllWithMethodAndOptions('PERSON_TEMP_PHOTOS', this._global.serializeAndURIEncode(this.options))
        .subscribe(result => {
          this.reservationImages = result;
          for(let i=0;i<this.reservationImages.length;i++) {
            this.reservationImages[i].is_portrait = (parseInt(this.reservationImages[i].is_portrait) == 1) ? true : false;
            this.reservationImages[i].url = './assets/images/zdjecia/large/'+this.reservationImages[i].file_name;
          }
        });
    });
  }
  
  selectReservationStone(data:any){
    this.reservationSelectedStone = data;
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

