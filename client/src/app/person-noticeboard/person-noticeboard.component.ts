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
import * as moment from 'moment';

export interface Options {
  limit:number;
};

@Component({
  selector: 'app-noticeboard',
  templateUrl: './person-noticeboard.component.html'
})
export class PersonNoticeboardComponent implements OnInit {
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
  reservationSelectedStoneId:string;
  reservationSelectedStoneData: any;
  reservationFirstname:string;
  reservationLastname:string;
  reservationDOB:string;
  reservationGender:string;
  reservationInMemoriam:string;
  reservationSignature:string;
  reservationSize:any;
  reservationClanName:string;
  isReservationSubTypeVisible:boolean = false;
  reservationFee:number;
  reservationCurrency:string="EUR";
  reservationCommunities:any[]=[];
  reservationImages:any[]=[];
  reservationPersons:any[]=[];
  reservationStones: any[] = [];
  reservationReligions: any[] = [];
  reservationSelectedReligionId: string;
  reservationSelectedReligionName: string;
  reservationData:any;
  reservationPrice: number;

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
  graveyardBurialSelectedStoneData: any;
  graveyardBurialFirstname:string;
  graveyardBurialLastname:string;
  graveyardBurialDOB:string;
  graveyardBurialDOD:string;
  graveyardBurialGender:string;
  graveyardBurialInMemoriam:string;
  graveyardBurialSignature:string;
  graveyardBurialSize:any;
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
  graveyardBurialSelectedReligionId: string;
  graveyardBurialSelectedReligionName: string;
  graveBurialPrice: number;
  
  selectedGraveyardReligionId:string = null;
  graveyardReligions:any[]=[];
  deadlistPages: number[] = [];
  searchedDeadPages: number[] = [];
  advertisements: Advertisement[] = [];
  users: User[] = [];
  searchedUsers: User[] = [];
  prioritizeGraves: User[] = [];
  USER_INFO:any = null;
  grave_number: number;
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
    if(!this.imageService.isImagesLoaded)
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
      this.graveyardBurialReligions = this.reservationReligions = this.graveyardReligions = result;
    });
    
    this.options = this._global.refreshObject(this.options, ['type=person_grave']);
    this.dataService.getAllWithMethodAndOptions('PRICES', this._global.serializeAndURIEncode(this.options))
      .subscribe(data => {
        this.graveBurialPrice = this.reservationPrice = parseFloat(data[0].price);
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

    //if(user.place_name == 'cmentarz' || user.place_name == 'Graveyard')
    //{
      this.selectedDeadPosition = (user.position - 1);
      this.router.navigateByUrl('/graveyard/'+this.selectedDeadPosition);
    //}
  }

  loadingPopularGrave(user:User, returnTab:string){
    if(returnTab)
      this.localStorageService.set(this._global.GRAVEYARD_RETURN_TAB, returnTab);
    
    let parameters = ['user_id='+user.user_id, 'limit=1', 'position=0'];
    this.localStorageService.set(this._global.GRAVEYARD_OPTIONS_KEY, parameters.join('|'));
    this.router.navigateByUrl('/graveyard/0');
  }

  randomSceneSelection(){
    this.isRandomSceneSelected = true;
    this.selectedSceneTime = this._global.getRandomNumber(1,2);
    this.selectedSceneSeason = this._global.getRandomNumber(1,4);
  }
  
  gotoGraveyard(){
    if(this.localStorageService.get(this._global.GRAVEYARD_OPTIONS_KEY))
      this.localStorageService.set(this._global.GRAVEYARD_OPTIONS_KEY, null);

    this._global.CURRENT_PAGE = 'header.menu.graveyard';
    this._router.navigateByUrl('/graveyard/0');
  }

  getGraveWithFirstname(alphabet: string){
    this.selectedDeadPage = 1;
    this.selectedDeadAlphabet = alphabet;
    this.options = this._global.refreshObject(this.options, ['limit=15', 'position=0', 'order=user_id', 'firstname='+this.selectedDeadAlphabet, 
    'death_date=zmarli']);
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
      let date_birth = moment(this.dob, "YYYY-MM-DD");
      parameters.push('birth_date='+date_birth);
    }
    
    if(this.dod){
      let date_death = moment(this.dob, "YYYY-MM-DD");
      parameters.push('death_date='+date_death);
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
      let parameters = ['limit=15', 'position='+ (this.selectedDeadPage - 1), 'order=user_id', 'death_date=zmarli'];
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

  getGraveyardBurialReligion(event: Event) {
    let selectedOptions = event.target['options'];
    let selectedIndex = selectedOptions.selectedIndex;
    this.graveyardBurialSelectedReligionName = selectedOptions[selectedIndex].text;
    this.graveyardBurialSelectedReligionId = selectedOptions[selectedIndex].value;
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
            this.graveyardBurialSelectedCommunity = "Atheistic";
      
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
          this.messageService.sendMessage('OPEN_CUSTOM_DIALOG', {'translationKey': 'PLEASE_SELECT_BURIAL_TYPE' });
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
        this.messageService.sendMessage('OPEN_CUSTOM_DIALOG', {'translationKey': 'PLEASE_SELECT_BURIAL_SUB_TYPE' });
        return;
      }
    }
    if(this.graveyardBurialCurrentStep == 2){
      if(this.graveyardBurialSelectedStoneId == null){
        this.messageService.sendMessage('OPEN_CUSTOM_DIALOG', {'translationKey': 'PLEASE_SELECT_STONE' });
        return;
      }
    }
    if(this.graveyardBurialCurrentStep == 3){
      if(this.graveyardBurialFirstname == null){
        this.messageService.sendMessage('OPEN_CUSTOM_DIALOG', {'translationKey': 'PLEASE_PROVIDE_FIRSTNAME' });
        return;
      }
      if(this.graveyardBurialLastname == null){
        this.messageService.sendMessage('OPEN_CUSTOM_DIALOG', {'translationKey': 'PLEASE_PROVIDE_LASTNAME' });
        return;
      }
      if(this.graveyardBurialDOB == null){
        this.messageService.sendMessage('OPEN_CUSTOM_DIALOG', {'translationKey': 'PLEASE_PROVIDE_DOB' });
        return;
      }
      if(this.graveyardBurialDOD == null){
        this.messageService.sendMessage('OPEN_CUSTOM_DIALOG', {'translationKey': 'PLEASE_PROVIDE_DOD' });
        return;
      }
      if(this.graveyardBurialGender == null){
        this.messageService.sendMessage('OPEN_CUSTOM_DIALOG', {'translationKey': 'PLEASE_SELECT_GENDER' });
        return;
      }
      if(this.graveyardBurialSelectedReligionId == null){
        this.messageService.sendMessage('OPEN_CUSTOM_DIALOG', {'translationKey': 'PLEASE_SELECT_RELIGION' });
        return;
      }
      if (this.graveyardBurialPersons.some((p) => (p.firstname+p.lastname) == this.graveyardBurialFirstname+this.graveyardBurialLastname)){
        this.messageService.sendMessage('OPEN_CUSTOM_DIALOG', {'translationKey': 'PERSON_ALREADY_EXISTS' });
        return;
      }

    }
    if(this.graveyardBurialCurrentStep == 4){
      if(this.graveyardBurialInMemoriam == null){
        this.messageService.sendMessage('OPEN_CUSTOM_DIALOG', {'translationKey': 'PLEASE_PROVIDE_IN_MEMORIAM' });
        return;
      }
      if(this.graveyardBurialSignature == null){
        this.messageService.sendMessage('OPEN_CUSTOM_DIALOG', {'translationKey': 'PLEASE_PROVIDE_SIGNATURE' });
        return;
      }
      
      this.graveyardBurialPersons.push({
        'firstname': this.graveyardBurialFirstname,
        'lastname': this.graveyardBurialLastname,
        'dob': moment(this.graveyardBurialDOB, "YYYY-MM-DD"),
        'dod': moment(this.graveyardBurialDOD, "YYYY-MM-DD"),
        'gender': this.graveyardBurialGender,
        'in_memoriam': this.graveyardBurialInMemoriam,
        'signature': this.graveyardBurialSignature,
        'unique_id': this.graveyardBurialUniqueId,
        'religion_id': this.graveyardBurialSelectedReligionId,
        'religion_name': this.graveyardBurialSelectedReligionName,
        'images': this.graveyardBurialImages
      });

      this.graveyardBurialImages = [];
      this.graveyardBurialUploadedImages = 0;
    }
    if(this.graveyardBurialCurrentStep == 6){
      this.graveyardBurialFee = this.graveyardBurialPersons.length * this.graveBurialPrice;
    }

    this.graveyardBurialCurrentStep++;
  }

  confirmAddingGraveyardBurial(){
    let place_id = 0;
    let grave_id = 0;
    let grave_image = 0;
    let payment_method = 1;
    let payment_id = 12345;
    let graveSize = parseInt(this.graveyardBurialSize, 10);
    let added_persons = [];

    if(this.graveyardBurialSelectedType == 'graveyard'){
      place_id = 1;

      if(this.graveyardBurialSelectedSubType == 'single'){
        grave_id = 1;
      }
      else if(this.graveyardBurialSelectedSubType == 'family'){
        grave_id = 2;
      }
      else if(this.graveyardBurialSelectedSubType == 'communal'){
        grave_id = 3;
      }
    }
    else if(this.graveyardBurialSelectedType == 'catacomb'){
      place_id = 3;
      grave_id = 1;
    }
    
    for(let i=0; i<=this.graveyardBurialPersons.length-1; i++) {
      this.options = this._global.refreshObject(this.options, ['method=ADD_PERSON', 'temp=0',
        'religion_id=' + this.graveyardBurialPersons[i].religion_id, 'religion_name=' + this.graveyardBurialPersons[i].religion_name, 
        'payment_method=' + payment_method, 'payment_id=' + payment_id, 'amount=' + this.graveBurialPrice, 'current_language=' + this.currentLang,
        'date_birth=' + this.graveyardBurialPersons[i].dob, 'date_death=' + this.graveyardBurialPersons[i].dod,
        'buyer_id=' + this.USER_INFO.buyer_id, 'place_id=' + place_id, 'grave_id=' + grave_id,
        'name=' + this.graveyardBurialPersons[i].firstname, 'surname=' + this.graveyardBurialPersons[i].lastname,
        'gender=' + this.graveyardBurialPersons[i].gender, 'grave_image=' + this.graveyardBurialSelectedStoneId,
        'bio_title=' + this.graveyardBurialPersons[i].signature, 'bio_body=' + this.graveyardBurialPersons[i].in_memoriam,
        'unique_id=' + this.graveyardBurialPersons[i].unique_id
      ]);
      this.dataService.createWithMethodAndOptions(this.options)
      .subscribe(result => {
        if(result && result['status'] == "PERSON_ADD_SUCCESS"){
          grave_image = result['grave_image'];
          added_persons.push(parseInt(result['user_id']))
        }
        else{
          this.messageService.sendMessage('OPEN_CUSTOM_DIALOG', {'translationKey': 'BURIAL_ERROR'});
        }

        if( graveSize == added_persons.length && added_persons.length > 0 && grave_id == 3){
          this.options = this._global.refreshObject(this.options, ['method=ADD_PERSON_MULTI_GRAVES', 'place_id=' + place_id,
              'family_name=' + this.graveyardBurialClanName, 'graves=' + added_persons, 'grave_image='+grave_image]);
          this.dataService.createWithMethodAndOptions(this.options)
          .subscribe(result => {
            if(result['status'] == 'MULTI_GRAVE_ADDED'){
              //result[multigrave_id]
              this.messageService.sendMessage('OPEN_CUSTOM_DIALOG', {'translationKey': 'BURIAL_DONE_SUCCESSFULLY' });
            }
          });
        }
      });
    }
    this.messageService.sendMessage('OPEN_CUSTOM_DIALOG', {'translationKey': 'BURIAL_DONE_SUCCESSFULLY' });
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
    this.graveyardBurialSelectedReligionId = null;
    this.graveyardBurialUniqueId = this.getUniqueCode(50);
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
        if(result){
          if(result['status'] == 'ERROR'){
            this.messageService.sendMessage('OPEN_CUSTOM_DIALOG', {'translationKey': 'PROBLEM_UPLOADING_PHOTO' });
          }
        }
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

  selectGraveyardBurialStone(data:any){
    this.graveyardBurialSelectedStoneId = data.substring(data.lastIndexOf('_')+1, data.length);
    this.graveyardBurialSelectedStoneData = data;
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
            this.reservationSelectedCommunity = "Atheistic";
      
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
          this.messageService.sendMessage('OPEN_CUSTOM_DIALOG', {'translationKey': 'PLEASE_SELECT_RESERVATION_SUB_TYPE' });
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
        this.messageService.sendMessage('OPEN_CUSTOM_DIALOG', {'translationKey': 'PLEASE_SELECT_RESERVATION_TYPE' });
        return;
      }
    }
    if(this.reservationCurrentStep == 2){
      if(this.reservationSelectedStoneId == null){
        this.messageService.sendMessage('OPEN_CUSTOM_DIALOG', {'translationKey': 'PLEASE_SELECT_STONE' });
        return;
      }
    }
    if(this.reservationCurrentStep == 3){
      if(this.reservationFirstname == null){
        this.messageService.sendMessage('OPEN_CUSTOM_DIALOG', {'translationKey': 'PLEASE_PROVIDE_FIRSTNAME' });
        return;
      }
      if(this.reservationLastname == null){
        this.messageService.sendMessage('OPEN_CUSTOM_DIALOG', {'translationKey': 'PLEASE_PROVIDE_LASTNAME' });
        return;
      }
      if(this.reservationDOB == null){
        this.messageService.sendMessage('OPEN_CUSTOM_DIALOG', {'translationKey': 'PLEASE_PROVIDE_DOB' });
        return;
      }
      if(this.reservationGender == null){
        this.messageService.sendMessage('OPEN_CUSTOM_DIALOG', {'translationKey': 'PLEASE_SELECT_GENDER' });
        return;
      }
      if(this.reservationSelectedReligionId == null){
        this.messageService.sendMessage('OPEN_CUSTOM_DIALOG', {'translationKey': 'PLEASE_SELECT_RELIGION' });
        return;
      }
      if (this.reservationPersons.some((p) => (p.firstname+p.lastname) == this.reservationFirstname+this.reservationLastname)){
        this.messageService.sendMessage('OPEN_CUSTOM_DIALOG', {'translationKey': 'PERSON_ALREADY_EXISTS' });
        return;
      }
    }
    if(this.reservationCurrentStep == 4){
      if(this.reservationInMemoriam == null){
        this.messageService.sendMessage('OPEN_CUSTOM_DIALOG', {'translationKey': 'PLEASE_PROVIDE_IN_MEMORIAM' });
        return;
      }
      if(this.reservationSignature == null){
        this.messageService.sendMessage('OPEN_CUSTOM_DIALOG', {'translationKey': 'PLEASE_PROVIDE_SIGNATURE' });
        return;
      }
      
      this.reservationPersons.push({
        'firstname': this.reservationFirstname,
        'lastname': this.reservationLastname,
        'dob': moment(this.reservationDOB, "YYYY-MM-DD"),
        'gender': this.reservationGender,
        'in_memoriam': this.reservationInMemoriam,
        'signature': this.reservationSignature,
        'unique_id': this.reservationUniqueId,
        'religion_id': this.reservationSelectedReligionId,
        'religion_name': this.reservationSelectedReligionName,
        'images': this.reservationImages
      });

      this.reservationImages = [];
      this.reservationUploadedImages = 0;
    }
    if(this.reservationCurrentStep == 6){
      this.reservationFee = this.reservationPersons.length * this.reservationPrice;
    }

    this.reservationCurrentStep++;
  }

  confirmAddingReservation(){
    let place_id = 0;
    let grave_id = 0;
    let grave_image = 0;
    let payment_method = 1;
    let payment_id = 12345;
    let reservationSize = parseInt(this.reservationSize, 10);
    let added_persons = [];

    if(this.reservationSelectedType == 'graveyard'){
      place_id = 1;

      if(this.reservationSelectedSubType == 'single'){
        grave_id = 1;
      }
      else if(this.reservationSelectedSubType == 'family'){
        grave_id = 2;
      }
      else if(this.reservationSelectedSubType == 'communal'){
        grave_id = 3;
      }
    }
    else if(this.reservationSelectedType == 'catacomb'){
      place_id = 3;
      grave_id = 1;
    }
    
    for(let i=0; i<=this.reservationPersons.length-1; i++) {
      this.options = this._global.refreshObject(this.options, ['method=ADD_PERSON', 'temp=0',
        'religion_id=' + this.reservationPersons[i].religion_id, 'religion_name=' + this.reservationPersons[i].religion_name, 
        'payment_method=' + payment_method, 'payment_id=' + payment_id, 'amount=' + this.reservationPrice, 'current_language=' + this.currentLang,
        'date_birth=' + this.reservationPersons[i].dob,
        'buyer_id=' + this.USER_INFO.buyer_id, 'place_id=' + place_id, 'grave_id=' + grave_id,
        'name=' + this.reservationPersons[i].firstname, 'surname=' + this.reservationPersons[i].lastname,
        'gender=' + this.reservationPersons[i].gender, 'grave_image=' + this.reservationSelectedStoneId,
        'bio_title=' + this.reservationPersons[i].signature, 'bio_body=' + this.reservationPersons[i].in_memoriam,
        'unique_id=' + this.reservationPersons[i].unique_id
      ]);
      this.dataService.createWithMethodAndOptions(this.options)
      .subscribe(result => {
        if(result && result['status'] == "PERSON_ADD_SUCCESS"){
          grave_image = result['grave_image'];
          added_persons.push(parseInt(result['user_id']))
        }
        else{
          this.messageService.sendMessage('OPEN_CUSTOM_DIALOG', {'translationKey': 'RESERVATION_ERROR'});
        }


        if( reservationSize == added_persons.length && added_persons.length > 0 && grave_id == 3){
          this.options = this._global.refreshObject(this.options, ['method=ADD_PERSON_MULTI_GRAVES', 'place_id=' + place_id,
              'family_name=' + this.graveyardBurialClanName, 'graves=' + added_persons, 'grave_image='+grave_image]);
          this.dataService.createWithMethodAndOptions(this.options)
          .subscribe(result => {
            if(result['status'] == 'MULTI_GRAVE_ADDED'){
              //result[multigrave_id]
              this.messageService.sendMessage('OPEN_CUSTOM_DIALOG', {'translationKey': 'RESERVATION_DONE_SUCCESSFULLY' });
            }
          });
        }
      });
    }
    this.messageService.sendMessage('OPEN_CUSTOM_DIALOG', {'translationKey': 'RESERVATION_DONE_SUCCESSFULLY' });
  }

  getReservationBurialReligion(event: Event) {
    let selectedOptions = event.target['options'];
    let selectedIndex = selectedOptions.selectedIndex;
    this.reservationSelectedReligionName = selectedOptions[selectedIndex].text;
    this.reservationSelectedReligionId = selectedOptions[selectedIndex].value;
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
    this.reservationGender = null;
    this.reservationInMemoriam = null;
    this.reservationSignature = null;
    this.reservationImages = [];
    this.reservationCurrentStep = 3;
    this.reservationSelectedReligionId = null;
    this.reservationUniqueId = this.getUniqueCode(50);
  }

  changeReservationPerson(person:any){
    this.reservationFirstname = person.firstname;
    this.reservationLastname = person.lastname;
    this.reservationDOB = person.dob;
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
        if(result){
          if(result['status'] == 'ERROR'){
            this.messageService.sendMessage('OPEN_CUSTOM_DIALOG', {'translationKey': 'PROBLEM_UPLOADING_PHOTO' });
          }
          else{
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
          }
        }
        
    });
  }
  
  selectReservationStone(data:any){
    this.reservationSelectedStoneId = data.substring(data.lastIndexOf('_')+1, data.length);
    this.reservationSelectedStoneData = data;
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

  goToGrave(){
    let user_id = this.grave_number;
    if(this.grave_number == null || !Number(this.grave_number)){
      this.messageService.sendMessage('OPEN_CUSTOM_DIALOG', {'translationKey': 'PLEASE_PROVIDE_GRAVE_NUMBER' });
      return;
    }

    let parameters = ['user_id='+user_id, 'limit=1', 'position=0'];
    this.options = this._global.refreshObject(this.options, parameters);
    this.localStorageService.set(this._global.GRAVEYARD_OPTIONS_KEY, parameters.join('|'));
    this.dataService.getAllWithMethodAndOptions('PERSONS', this._global.serializeAndURIEncode(this.options))
      .subscribe(persons => {
        if(persons.length == 0){
          this.messageService.sendMessage('OPEN_CUSTOM_DIALOG', {'translationKey': 'PERSON_NOT_FOUND' });
          return;
        }
        else{
          let person = persons[0];
          person.position = 1;
          this.loadingGrave(person, 'graveyard-noticeboard');
        }
      });
  }

  goToGraveyardByReligion(returnTab: string){debugger;
    if(this.selectedGraveyardReligionId == null){
      this.messageService.sendMessage('OPEN_CUSTOM_DIALOG', {'translationKey': 'PLEASE_SELECT_GRAVEYARD' });
      return;
    }

    if(returnTab)
      this.localStorageService.set(this._global.GRAVEYARD_RETURN_TAB, returnTab);
  
    let parameters = ['religion_id='+this.selectedGraveyardReligionId, 'limit=10', 'position=0'];
    this.localStorageService.set(this._global.GRAVEYARD_OPTIONS_KEY, parameters.join('|'));
    this.router.navigateByUrl('/graveyard/0');
  }
}

