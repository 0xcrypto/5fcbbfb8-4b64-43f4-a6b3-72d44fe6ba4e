import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { Advertisement } from '../classes/advertisement';
import { DataService } from '../services/data.service';
import { Router } from '@angular/router';
import { AppGlobals } from '../app.globals';
import { CookieStorage, LocalStorage, SessionStorage, LocalStorageService } from 'ngx-store';

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
  currentBurialStep:number = 1;
  totalBurialSteps:number = 6;

  animalListPages: number[] = [];
  searchedAnimalPages: number[] = [];
  advertisements: Advertisement[] = [];
  animals: any[] = [];
  searchedAnimals: any[] = [];
  prioritizedAnimals: any[] = [];
  grave_stones: any[] = [];

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
    private localStorageService: LocalStorageService) {
    this.router = _router;
  }

  ngOnInit() {
    this.selectedTab = 'graveyard-noticeboard';
    this.currentLang = this._global.getLanguage();

    this.getAdvertisements();
    this.getVisibleAnimals();

    this.options = this._global.refreshObject(this.options, []);
    this.dataService.getAllWithMethodAndOptions('ANIMAL_GRAVE_TILE_IMAGES', this._global.serializeAndURIEncode(this.options))
    .subscribe(result => {debugger;
      this.grave_stones = result;

      for(var i=0; i<=this.grave_stones.length-1; i++){
        this.grave_stones[i] = {
          'min': './assets/images/graves/mini/'+ this.grave_stones[i],
          'max': './assets/images/graves/maxi/'+ this.grave_stones[i]
        };
      }
    });
    
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
    
    var parameters = ['position='+ (this.selectedAnimalPage - 1),
    'order=animal_id'];

    if(this.selectedAnimalAlphabet)
      parameters.push('firstname='+this.selectedAnimalAlphabet);

    this.options = this._global.refreshObject(this.options, parameters);
    
    this.getAnimals(this._global.serializeAndURIEncode(this.options));
  }

  showAllAnimals(){
    this.selectedAnimalPage = 1;
    this.options = this._global.refreshObject(this.options, ['position='+ (this.selectedAnimalPage - 1),
     'order=animal_id']);
    this.getAnimals(this._global.serializeAndURIEncode(this.options));
  }

  getNextPageAnimals(){
    if(this.isNavigateNextAnimalDisabled)
      return;
    
      this.selectedAnimalPage++;
      this.options = this._global.refreshObject(this.options, ['position='+ (this.selectedAnimalPage - 1),
      'order=animal_id']);
      this.getAnimals(this._global.serializeAndURIEncode(this.options));
  }

  getPreviousPageAnimals(){
    if(this.isNavigatePreviousAnimalDisabled)
      return;

      this.selectedAnimalPage--;
      this.options = this._global.refreshObject(this.options, ['position='+ (this.selectedAnimalPage - 1),
      'order=animal_id']);
      this.getAnimals(this._global.serializeAndURIEncode(this.options));
  }

  searchAnimalsWithFirstname(alphabet: string){
    this.selectedSearchedAnimalPage = 1;
    this.selectedSearchedAnimalAlphabet = alphabet;
    this.searchOptions = this._global.refreshObject(this.searchOptions, ['order=animal_id', 
    'firstname='+this.selectedSearchedAnimalAlphabet]);
    this.searchAnimals(this._global.serializeAndURIEncode(this.searchOptions));
  }

  searchAnimalsWithPageNumber(pageNumber: number){
    this.selectedSearchedAnimalPage = pageNumber;
    var parameters = ['position='+(this.selectedSearchedAnimalPage - 1),
    'order=animal_id'];

    if(this.selectedSearchedAnimalAlphabet)
      parameters.push('firstname='+this.selectedSearchedAnimalAlphabet);
    
    this.searchOptions = this._global.refreshObject(this.searchOptions, parameters);
    this.searchAnimals(this._global.serializeAndURIEncode(this.searchOptions));
  }

  searchAllAnimals(){
    this.selectedSearchedAnimalPage = 1;
    this.searchOptions = this._global.refreshObject(this.searchOptions, ['position='+(this.selectedSearchedAnimalPage - 1),
      'order=animal_id']);
    this.searchAnimals(this._global.serializeAndURIEncode(this.searchOptions));
  }

  searchNextPageAnimals(){
    if(this.isNavigateNextSearchedAnimalDisabled)
      return;

    this.selectedSearchedAnimalPage++;
    this.searchOptions = this._global.refreshObject(this.searchOptions, ['position='+(this.selectedSearchedAnimalPage - 1),
      'order=animal_id']);
    this.searchAnimals(this._global.serializeAndURIEncode(this.searchOptions));
  }

  searchPreviousPageAnimals(){
    if(this.isNavigatePreviousSearchedAnimalDisabled)
      return;
    
    this.selectedSearchedAnimalPage--;
    this.searchOptions = this._global.refreshObject(this.searchOptions, ['position='+(this.selectedSearchedAnimalPage - 1),
      'order=animal_id']);
    this.searchAnimals(this._global.serializeAndURIEncode(this.searchOptions));
  }
  
  submitSearch(){
    var parameters = ['order=animal_id']
    if(this.name)
      parameters.push('name='+this.name);
    
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
  burialPrevStep(){
    this.currentBurialStep--;
  }
  burialNextStep(){
    this.currentBurialStep++;
  }
}
