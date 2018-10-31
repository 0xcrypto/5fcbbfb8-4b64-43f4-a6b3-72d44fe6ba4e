import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { Advertisement } from '../classes/advertisement';
import { DataService } from '../services/data.service';
import { MessageService } from '../services/message.service';
import { ImageService } from '../services/image.service';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { AppGlobals } from '../app.globals';
import { CookieStorage, LocalStorage, SessionStorage, LocalStorageService } from 'ngx-store';
import * as moment from 'moment';

export interface Options {};

@Component({
  selector: 'app-animal-noticeboard',
  templateUrl: './animal-noticeboard.component.html'
})
export class AnimalNoticeboardComponent implements OnInit {
  isAnimalLoadingScreenVisible:boolean = false;
  isSearchFormVisible:boolean = true;
  isNavigatePreviousAnimalDisabled:boolean = false;
  isNavigateNextAnimalDisabled:boolean = false;
  isNavigatePreviousSearchedAnimalDisabled:boolean = false;
  isNavigateNextSearchedAnimalDisabled:boolean = false;
  isRandomSceneSelected:boolean = false;
  selectedTab:string = null;
  selectedAnimalPosition: number = 0;
  totalAnimals: number = 0;
  totalSearchedAnimals: number = 0;
  totalPagesInAnimalList: number = 0;
  totalPagesInSearchedAnimalList: number = 0;
  loadingData:boolean = false;
  searchingData:boolean = false;
  selectedAnimalPage:number = 1;
  selectedAnimalAlphabet:string = null;
  selectedSearchedAnimalPage:number = 1;
  selectedSearchedAnimalAlphabet:string = null;
  selectedSceneTime:number = 1;
  selectedSceneSeason:number = 1;
  datalimit = 15;

  /* GRAVEYARD BURIAL INFORMATION */
  graveyardBurialCurrentStep:number = 1;
  graveyardBurialTotalSteps:number = 6;
  graveyardBurialSelectedCommunity:string;
  graveyardBurialUniqueId:string;
  graveyardBurialUploadedImages:number = 0;
  graveyardBurialTotalImages:number = 7;
  graveyardBurialSelectedType:string;
  graveyardBurialSelectedSubType:string;
  graveyardBurialSelectedStoneId:string;
  graveyardBurialSelectedStoneData: any;
  graveyardBurialPetName:string;
  graveyardBurialGenus:string;
  graveyardBurialPetType:string;
  graveyardBurialDOB:string;
  graveyardBurialDOD:string;
  graveyardBurialGender:string;
  graveyardBurialOwnerFirstname:string;
  graveyardBurialOwnerLastname:string;
  graveyardBurialInMemoriam:string;
  graveyardBurialSignature:string;
  graveyardBurialSize:any;
  graveyardBurialClanName:string;
  isGraveyardBurialSubTypeVisible:boolean = false;
  graveyardBurialFee:number;
  graveyardBurialCurrency:string="EUR";
  graveyardBurialCommunities:any[]=[];
  graveyardBurialImages:any[]=[];
  graveyardBurialAnimals:any[]=[];
  graveyardBurialAnimalGenusList:any[]=[];
  graveyardBurialStones: any[] = [];
  graveyardBurialData:any;
  graveBurialPrice: number;

  animalListPages: number[] = [];
  searchedAnimalPages: number[] = [];
  advertisements: Advertisement[] = [];
  animals: any[] = [];
  searchedAnimals: any[] = [];
  prioritizedAnimals: any[] = [];
  USER_INFO:any = null;

  router:Router = null;
  currentLang:string = null;
  alphabetPages: any[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  /* search form properties */
  name:string = null;
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
    private userService:UserService) {
    this.router = _router;
  }

  ngOnInit() {
    if(this.imageService.cachedImages.length == 0)
      this.router.navigateByUrl('/home');

    this.selectedTab = 'graveyard-noticeboard';
    this.currentLang = this._global.getLanguage();

    this.userService.castUser.subscribe(user => this.USER_INFO = user);

    this.getAdvertisements();
    this.getVisibleAnimals();
    
    this.options = this._global.refreshObject(this.options, []);
    this.dataService.getAllWithMethodAndOptions('ANIMAL_TYPES', this._global.serializeAndURIEncode(this.options))
    .subscribe(result => {
      if(result.length > 0)
        this.graveyardBurialAnimalGenusList = result;
    });

    this.options = this._global.refreshObject(this.options, ['type=animal_grave']);
    this.dataService.getAllWithMethodAndOptions('PRICES', this._global.serializeAndURIEncode(this.options))
      .subscribe(result => {
        if(result.length > 0)
          this.graveBurialPrice = parseFloat(result[0].price);
      }
    );

    if(this.localStorageService.get(this._global.ANIMAL_GRAVEYARD_RETURN_TAB) &&
        this.localStorageService.get(this._global.ANIMAL_GRAVEYARD_OPTIONS_KEY)){

      this.selectedTab = this.localStorageService.get(this._global.ANIMAL_GRAVEYARD_RETURN_TAB);
      this.localStorageService.set(this._global.GRAVEYARD_RETURN_TAB, null);
      let parameters = this.localStorageService.get(this._global.ANIMAL_GRAVEYARD_OPTIONS_KEY).split('|');
      
      if(parameters && this.selectedTab == 'book-of-dead'){
        this.loadData(parameters);
      }
      else if(parameters && this.selectedTab == 'search'){
        this.loadSearchData(parameters);
      }
    }
    
    this.messageService.castMessage.subscribe(object => {
      
    });
  }

  loadingAnimal(animal:any, returnTab:string){
    if(returnTab){
      this.localStorageService.set(this._global.ANIMAL_GRAVEYARD_RETURN_TAB, returnTab);
    }

    this.selectedAnimalPosition = (animal.position - 1);
    this.isAnimalLoadingScreenVisible = true;
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
    this.router.navigateByUrl('/pet-graveyard/'+this.selectedAnimalPosition+'/'+scene);
  }

  gotoGraveyard(){
    let scene = this._global.getRandomNumber(1,2)+"_"+this._global.getRandomNumber(1,4);
    this.router.navigateByUrl('/pet-graveyard/0/'+scene);
  }

  getAnimalWithFirstname(alphabet: string){
    this.selectedAnimalPage = 1;
    this.selectedAnimalAlphabet = alphabet;
    this.options = this._global.refreshObject(this.options, ['order=animal_id', 'firstname='+this.selectedAnimalAlphabet]);
    this.getAnimals(this._global.serializeAndURIEncode(this.options));
  }

  getAnimalsWithPageNumber(pageNumber: number){
    this.selectedAnimalPage = pageNumber;
    
    var parameters = ['position='+ (this.selectedAnimalPage - 1), 'order=animal_id'];

    if(this.selectedAnimalAlphabet)
      parameters.push('firstname='+this.selectedAnimalAlphabet);

    this.options = this._global.refreshObject(this.options, parameters);
    
    this.getAnimals(this._global.serializeAndURIEncode(this.options));
  }

  showAllAnimals(){
    this.selectedAnimalPage = 1;
    this.options = this._global.refreshObject(this.options, ['position='+ (this.selectedAnimalPage - 1), 'order=animal_id']);
    this.getAnimals(this._global.serializeAndURIEncode(this.options));
  }

  getNextPageAnimals(){
    if(this.isNavigateNextAnimalDisabled)
      return;
    
      this.selectedAnimalPage++;
      this.options = this._global.refreshObject(this.options, ['position='+ (this.selectedAnimalPage - 1), 'order=animal_id']);
      this.getAnimals(this._global.serializeAndURIEncode(this.options));
  }

  getPreviousPageAnimals(){
    if(this.isNavigatePreviousAnimalDisabled)
      return;

      this.selectedAnimalPage--;
      this.options = this._global.refreshObject(this.options, ['position='+ (this.selectedAnimalPage - 1), 'order=animal_id']);
      this.getAnimals(this._global.serializeAndURIEncode(this.options));
  }

  searchAnimalsWithFirstname(alphabet: string){
    this.selectedSearchedAnimalPage = 1;
    this.selectedSearchedAnimalAlphabet = alphabet;
    this.searchOptions = this._global.refreshObject(this.searchOptions, ['order=animal_id', 'firstname='+this.selectedSearchedAnimalAlphabet]);
    this.searchAnimals(this._global.serializeAndURIEncode(this.searchOptions));
  }

  searchAnimalsWithPageNumber(pageNumber: number){
    this.selectedSearchedAnimalPage = pageNumber;
    var parameters = ['position='+(this.selectedSearchedAnimalPage - 1), 'order=animal_id'];

    if(this.selectedSearchedAnimalAlphabet)
      parameters.push('firstname='+this.selectedSearchedAnimalAlphabet);
    
    this.searchOptions = this._global.refreshObject(this.searchOptions, parameters);
    this.searchAnimals(this._global.serializeAndURIEncode(this.searchOptions));
  }

  searchAllAnimals(){
    this.selectedSearchedAnimalPage = 1;
    this.searchOptions = this._global.refreshObject(this.searchOptions, ['position='+(this.selectedSearchedAnimalPage - 1), 'order=animal_id']);
    this.searchAnimals(this._global.serializeAndURIEncode(this.searchOptions));
  }

  searchNextPageAnimals(){
    if(this.isNavigateNextSearchedAnimalDisabled)
      return;

    this.selectedSearchedAnimalPage++;
    this.searchOptions = this._global.refreshObject(this.searchOptions, ['position='+(this.selectedSearchedAnimalPage - 1), 'order=animal_id']);
    this.searchAnimals(this._global.serializeAndURIEncode(this.searchOptions));
  }

  searchPreviousPageAnimals(){
    if(this.isNavigatePreviousSearchedAnimalDisabled)
      return;
    
    this.selectedSearchedAnimalPage--;
    this.searchOptions = this._global.refreshObject(this.searchOptions, ['position='+(this.selectedSearchedAnimalPage - 1), 'order=animal_id']);
    this.searchAnimals(this._global.serializeAndURIEncode(this.searchOptions));
  }
  
  submitSearch(){
    var parameters = ['order=animal_id']
    if(this.name)
      parameters.push('name='+this.name);
    
    if(this.dob){
      
      let birth_date = moment(this.dob, "YYYY-MM-DD");
      parameters.push('birth_date='+birth_date);
    }
    
    if(this.dod){
      let death_date = moment(this.dod, "YYYY-MM-DD");
      parameters.push('death_date='+death_date);
    }

    this.loadSearchData(parameters);
  }

  loadSearchData(parameters:string[]){
    this.selectedSearchedAnimalPage = 1;
    this.isSearchFormVisible = false;
    parameters.push('position='+(this.selectedSearchedAnimalPage - 1));
    this.localStorageService.set(this._global.ANIMAL_GRAVEYARD_OPTIONS_KEY, parameters.join('|'));
    this.searchOptions = this._global.refreshObject(this.searchOptions, parameters);
    this.searchAnimals(this._global.serializeAndURIEncode(this.searchOptions));
  }

  openTab(name:string) {
    this.selectedTab = name;

    if(this.selectedTab == 'book-of-dead'){
      this.selectedAnimalPage = 1;
      let parameters = ['position='+ (this.selectedAnimalPage - 1), 'order=animal_id'];
      this.loadData(parameters);
    }
    
    if(this.selectedTab == 'graveyard-noticeboard'){
      this.getAdvertisements();
      this.getVisibleAnimals();
    }

    if(this.selectedTab == 'graveyard-burial'){
      this.graveyardBurialUniqueId = this.getUniqueCode(50);
    }
  }

  loadData(parameters:string[]){
    this.options = this._global.refreshObject(this.options, parameters);
    this.localStorageService.set(this._global.ANIMAL_GRAVEYARD_OPTIONS_KEY, parameters.join('|'));
    this.getAnimals(this._global.serializeAndURIEncode(this.options));
  }

  backToSearch(){
    this.isSearchFormVisible = true;
  }

  getAdvertisements(): void {
    this.options = this._global.refreshObject(this.options, ['limit=3']);
    this.dataService.getAllWithMethodAndOptions('ADVERTISEMENTS', this._global.serializeAndURIEncode(this.options))
      .subscribe(advertisements => this.advertisements = advertisements);
  }

  updateDeadObject(animals: any[], type:string){
    let start = (type=="deadlist") ? ((this.selectedAnimalPage - 1) * this.datalimit) : ((this.selectedSearchedAnimalPage - 1) * this.datalimit);
    
    for(let i=0; i<=animals.length-1;i++){
      animals[i]['position'] = start + (i+1);
      if(animals[i].place_name == 'inne - specjalne'){
        animals[i].place_name = 'Special';
      }
    }
    return animals;
  }

  getAnimals(param: string): void {
    this.loadingData = true;
    this.dataService.getAllWithMethodAndOptions('ANIMALS', param)
      .subscribe(animals => {
        this.loadingData = false;
        this.animals = animals;
        if(animals.length > 0){
          animals = this.updateDeadObject(animals, 'deadlist');
          this.totalAnimals = parseInt(animals[0].ilosc);
          this.totalPagesInAnimalList = Math.ceil(this.totalAnimals / this.datalimit);
          this.animalListPages = this._global.getPagination(this.selectedAnimalPage, this.totalPagesInAnimalList);
        }

        if(this.selectedAnimalPage == 1){
          this.isNavigatePreviousAnimalDisabled = true;
        }
        else{
          this.isNavigatePreviousAnimalDisabled = false;
        }
        
        if(this.selectedAnimalPage == this.totalPagesInAnimalList){
          this.isNavigateNextAnimalDisabled = true;
        }
        else{
          this.isNavigateNextAnimalDisabled = false;
        }
      });
  }

  getVisibleAnimals(): void {
    this.options = this._global.refreshObject(this.options, ['limit=3', 'position=0', 'order=animal_id', 'visibility=1']);
    this.dataService.getAllWithMethodAndOptions('ANIMALS', this._global.serializeAndURIEncode(this.options))
      .subscribe(animals => {
        delete this.options['visibility'];
        this.prioritizedAnimals = animals.slice(0,3);
      });
  }

  searchAnimals(param: string): void {
    this.searchingData = true;
    this.dataService.getAllWithMethodAndOptions('ANIMALS', param)
      .subscribe(animals => {
        this.searchingData = false;
        this.searchedAnimals = animals;
        if(animals.length > 0){
          animals = this.updateDeadObject(animals, 'searchlist');
          this.totalSearchedAnimals = parseInt(animals[0].ilosc);
          this.totalPagesInSearchedAnimalList = Math.ceil(this.totalSearchedAnimals / this.datalimit);
          this.searchedAnimalPages = this._global.getPagination(this.selectedSearchedAnimalPage, this.totalPagesInSearchedAnimalList);
        }

        if(this.selectedSearchedAnimalPage == 1){
          this.isNavigatePreviousSearchedAnimalDisabled = true;
        }
        
        if(this.selectedSearchedAnimalPage == this.totalPagesInAnimalList){
          this.isNavigateNextSearchedAnimalDisabled = true;
        }
        
      });
  }

  /* GRAVE BURIAL */
  graveyardBurialPreviousStep(){
    this.graveyardBurialCurrentStep--;
  }

  graveyardBurialNextStep(){
    if(this.graveyardBurialCurrentStep == 1){
      this.options = this._global.refreshObject(this.options, ['grave_type=PetGraveyard_Single']);
      this.dataService.getAllWithMethodAndOptions('ANIMAL_GRAVE_TILE_IMAGES', this._global.serializeAndURIEncode(this.options))
      .subscribe(result => {
        this.graveyardBurialStones = result;
  
        for(var i=0; i<=this.graveyardBurialStones.length-1; i++){
          this.graveyardBurialStones[i].data = this.graveyardBurialStones[i].grave;
          this.graveyardBurialStones[i].min = './assets/images/graves/mini/'+ this.graveyardBurialStones[i].grave+'.jpg';
          this.graveyardBurialStones[i].max = './assets/images/graves/maxi/'+ this.graveyardBurialStones[i].grave+'.jpg';
        }
      });
    }
    if(this.graveyardBurialCurrentStep == 2){
      if(this.graveyardBurialSelectedStoneId == null){
        this.messageService.sendMessage('OPEN_CUSTOM_DIALOG', {'translationKey': 'PLEASE_SELECT_STONE' });
        return;
      }
    }
    if(this.graveyardBurialCurrentStep == 3){
      if(this.graveyardBurialPetName == null){
        this.messageService.sendMessage('OPEN_CUSTOM_DIALOG', {'translationKey': 'PLEASE_PROVIDE_PETNAME' });
        return;
      }
      if(this.graveyardBurialGenus == null){
        this.messageService.sendMessage('OPEN_CUSTOM_DIALOG', {'translationKey': 'PLEASE_PROVIDE_GENUS' });
        return;
      }
      if(this.graveyardBurialPetType == null){
        this.messageService.sendMessage('OPEN_CUSTOM_DIALOG', {'translationKey': 'PLEASE_PROVIDE_PET_TYPE' });
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
        this.messageService.sendMessage('OPEN_CUSTOM_DIALOG', {'translationKey': 'PLEASE_PROVIDE_GENDER' });
        return;
      }
      if(this.graveyardBurialOwnerFirstname == null){
        this.messageService.sendMessage('OPEN_CUSTOM_DIALOG', {'translationKey': 'PLEASE_PROVIDE_OWNER_FIRSTNAME' });
        return;
      }
      if(this.graveyardBurialOwnerLastname == null){
        this.messageService.sendMessage('OPEN_CUSTOM_DIALOG', {'translationKey': 'PLEASE_PROVIDE_OWNER_LASTNAME' });
        return;
      }
      if (this.graveyardBurialAnimals.some((a) => (a.petname) == this.graveyardBurialPetName)){
        this.messageService.sendMessage('OPEN_CUSTOM_DIALOG', {'translationKey': 'DETAILS_ALREADY_EXISTS' });
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

      this.graveyardBurialAnimals.push({
        'petname': this.graveyardBurialPetName,
        'genus': this.graveyardBurialGenus,
        'type': this.graveyardBurialPetType,
        'dob': moment(this.graveyardBurialDOB, "YYYY-MM-DD"),
        'dod': moment(this.graveyardBurialDOD, "YYYY-MM-DD"),
        'gender': this.graveyardBurialGender,
        'owner_firstname': this.graveyardBurialOwnerFirstname,
        'owner_lastname': this.graveyardBurialOwnerLastname,
        'in_memoriam': this.graveyardBurialInMemoriam,
        'signature': this.graveyardBurialSignature,
        'unique_id': this.graveyardBurialUniqueId,
        'images': this.graveyardBurialImages
      });

      this.graveyardBurialImages = [];
      this.graveyardBurialUploadedImages = 0;
    }
    if(this.graveyardBurialCurrentStep == 5){
      this.graveyardBurialFee = this.graveyardBurialAnimals.length * this.graveBurialPrice;
    }

    this.graveyardBurialCurrentStep++;
  }

  confirmAddingGraveyardBurial(){
    let grave_id = 1;
    let payment_method = 1;
    let payment_id = 12345;
    let graveSize = parseInt(this.graveyardBurialSize, 10);
    let added_animals = [];
    
    for(let i=0; i<=this.graveyardBurialAnimals.length-1; i++) {
      this.options = this._global.refreshObject(this.options, ['method=ADD_ANIMAL', 'temp=0',
        'payment_method=' + payment_method, 'payment_id=' + payment_id, 'amount=' + this.graveBurialPrice, 'current_language=' + this.currentLang,
        'date_birth=' + this.graveyardBurialAnimals[i].dob, 'date_death=' + this.graveyardBurialAnimals[i].dod,
        'buyer_id=' + this.USER_INFO.buyer_id, 'al_id=' + this.graveyardBurialAnimals[i].genus,  'gender=' + this.graveyardBurialAnimals[i].gender, 
        'animalkind=' + this.graveyardBurialAnimals[i].type, 'name=' + this.graveyardBurialAnimals[i].firstname, 
        'owner_name=' + this.graveyardBurialAnimals[i].owner_firstname, 'owner_surname=' + this.graveyardBurialAnimals[i].owner_lastname,
        'grave_image=' + this.graveyardBurialSelectedStoneId, 'grave_id=' + grave_id, 'image_url=',
        'live_history=' + this.graveyardBurialAnimals[i].in_memoriam, 'live_history_signature=' + this.graveyardBurialAnimals[i].signature,
        'unique_id=' + this.graveyardBurialAnimals[i].unique_id
      ]);
      this.dataService.createWithMethodAndOptions(this.options)
      .subscribe(result => {
        if(result && result['status'] == "ANIMAL_ADD_SUCCESS"){
          added_animals.push(parseInt(result['animal_id']));
          this.messageService.sendMessage('OPEN_CUSTOM_DIALOG', {'translationKey': 'BURIAL_DONE_SUCCESSFULLY'}, function(){
            this._router.navigateByUrl('/home');
          });
        }
        else{
          this.messageService.sendMessage('OPEN_CUSTOM_DIALOG', {'translationKey': 'BURIAL_ERROR'});
        }
      });
    }
    
  }

  changeGraveyardBurialType(){
    if(this.graveyardBurialSelectedType == 'graveyard'){
      this.isGraveyardBurialSubTypeVisible = true;
    }
    else{
      this.isGraveyardBurialSubTypeVisible = false;
    }
  }

  changeGraveyardBurialAnimal(animal:any){
    this.graveyardBurialPetName = animal.petname;
    this.graveyardBurialGenus = animal.genus;
    this.graveyardBurialPetType = animal.type;
    this.graveyardBurialDOB = animal.dob;
    this.graveyardBurialDOD = animal.dod;
    this.graveyardBurialGender = animal.gender;
    this.graveyardBurialOwnerFirstname = animal.owner_firstname;
    this.graveyardBurialOwnerLastname = animal.owner_lastname;
    this.graveyardBurialInMemoriam = animal.in_memoriam;
    this.graveyardBurialSignature = animal.signature;
    this.graveyardBurialImages = [];
    this.graveyardBurialCurrentStep = 3;

  }

  removeGraveyardBurialAnimal(person:any){
    this.graveyardBurialAnimals = this.graveyardBurialAnimals
      .filter(p => p.firstname !== person.firstname);
    if(this.graveyardBurialAnimals.length == 0){
      this.graveyardBurialCurrentStep = 3;
    }
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
    formData.append('method', 'ADD_ANIMAL_TEMP_PHOTO');
    if(this.graveyardBurialUploadedImages == 0){
      formData.append('is_portrait', '1');
    }
      
    this.dataService.uploadWithMethodAndOptions(formData, headers)
      .subscribe(result => {
        if(result){
          if(result['status']== 'ERROR'){
            this.messageService.sendMessage('OPEN_CUSTOM_DIALOG', {'translationKey': 'PROBLEM_UPLOADING_PHOTO' });
          }
          else{
            this.graveyardBurialUploadedImages++;
            this.options = this._global.refreshObject(this.options, ['unique_id='+this.graveyardBurialUniqueId]);
            this.dataService.getAllWithMethodAndOptions('ANIMAL_TEMP_PHOTOS', this._global.serializeAndURIEncode(this.options))
            .subscribe(result => {
              this.graveyardBurialImages = result;
              for(let i=0;i<this.graveyardBurialImages.length;i++) {
                this.graveyardBurialImages[i].is_portrait = (parseInt(this.graveyardBurialImages[i].is_portrait) == 1) ? true : false;
                this.graveyardBurialImages[i].url = './assets/images/zdjecia/large/'+this.graveyardBurialImages[i].file_name;
              }
            });
          }
        }
    });
  }

  selectGraveyardBurialStone(data:any){
    this.graveyardBurialSelectedStoneId = data.substring(data.lastIndexOf('_')+1, data.length);
    this.graveyardBurialSelectedStoneData = data;
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
