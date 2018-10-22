import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PayPalConfig, PayPalEnvironment, PayPalIntegrationType } from 'ngx-paypal';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import * as moment from 'moment'; 

import { DataService } from '../services/data.service';
import { MessageService } from '../services/message.service';
import { UserService } from '../services/user.service';
import { AppGlobals } from '../app.globals';

export interface Options {};

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html'
})
export class ShopComponent implements OnInit {
  candles: any[] = [];
  flowers: any[] = [];
  stones: any[] = [];
  cards: any[] = [];
  router:Router = null;
  options:Options = {};
  isShopDialogOpen:boolean = false;
  selectedShopTab:string = null;
  selectedGraveId:number;
  selectedGraveName:string;
  source:string;
  TODAY_DATE:string;
  valid_upto:string = null;
  dedication:string = null;
  currentLang:string = null;
  isCandleShopFormVisible:boolean = false;
  isFlowerShopFormVisible:boolean = false;
  isStoneShopFormVisible:boolean = false;
  isOtherShopFormVisible:boolean = false;
  isPaymentCompleted:boolean = false
  isSelectedGraveNotAvailable:boolean = false;
  isItemAlreadyExists:boolean = false;
  selectedObjectPrice:number;
  selectedObjectCurrency:string;
  selectedObjectId:string;
  selectedObjectName:string;
  searchGraveType:string;
  searchGraveNumber:string;
  noSearchResult:boolean = false;
  candlePrices: any[]=[];
  flowerPrices: any[]=[];
  stonePrices: any[]=[];
  otherPrices: any[]=[];
  candle_price:string = null;
  flower_price:string = null;
  stone_price:string = null;
  other_price:string = null;
  USER_INFO:any = null;
  payment_id:number = null;
  payPalConfig?: PayPalConfig;

  constructor(
      private route: ActivatedRoute,  
      private dataService: DataService, 
      private _global: AppGlobals, 
      private _router: Router, 
      private messageService:MessageService,  
      private userService:UserService 
    ) {
    this.router = _router;
  }

  ngOnInit() {
    this.selectedShopTab = 'tab1';
    this.currentLang = this._global.getLanguage();
    this.userService.castUser.subscribe(user => this.USER_INFO = user);

    this.messageService.castMessage.subscribe(object => {
      let message = object.message;
      let data = object.data;
debugger;
      switch(message){
        case "OPEN_SHOP":
          this.openShop(data);
          break;
      }
    });
    
    this.options = this._global.refreshObject(this.options, []);
    this.dataService.getAllWithMethodAndOptions('TODAY_DATE', this._global.serializeAndURIEncode(this.options))
    .subscribe(result => {
      if(result['today_date']){
        this.TODAY_DATE = result['today_date'];
      }
    });

    this.options = this._global.refreshObject(this.options, ['type=candle']);
    this.dataService.getAllWithMethodAndOptions('PRICES', this._global.serializeAndURIEncode(this.options))
      .subscribe(data => {
        this.candlePrices = data;
      }
    );

    this.options = this._global.refreshObject(this.options, []);
    this.dataService.getAllWithMethodAndOptions('CANDLE_TILE_IMAGES', this._global.serializeAndURIEncode(this.options))
    .subscribe(result => {
      this.candles = result;

      for(var i=0; i<=this.candles.length-1; i++)
        this.candles[i] = './assets/images/znicze/mini_znicze/'+ this.candles[i];
    });

    this.options = this._global.refreshObject(this.options, []);
    this.dataService.getAllWithMethodAndOptions('FLOWER_TILE_IMAGES', this._global.serializeAndURIEncode(this.options))
    .subscribe(result => {
      this.flowers = result;

      for(var i=0; i<=this.flowers.length-1; i++)
        this.flowers[i] = './assets/images/znicze/mini_kwiaty/'+ this.flowers[i];
    });

    this.options = this._global.refreshObject(this.options, []);
    this.dataService.getAllWithMethodAndOptions('STONE_TILE_IMAGES', this._global.serializeAndURIEncode(this.options))
    .subscribe(result => {
      this.stones = result;

      for(var i=0; i<=this.stones.length-1; i++)
        this.stones[i] = './assets/images/znicze/mini_kamienie/'+ this.stones[i];
    });

    this.options = this._global.refreshObject(this.options, []);
    this.dataService.getAllWithMethodAndOptions('CARD_TILE_IMAGES', this._global.serializeAndURIEncode(this.options))
    .subscribe(result => {
      this.cards = result;

      for(var i=0; i<=this.cards.length-1; i++)
        this.cards[i] = './assets/images/znicze/mini_kartki/'+ this.cards[i];
    });
  }

  private initPayPalConfig(currency:string, price:number): void {

    this.payPalConfig = new PayPalConfig(
      PayPalIntegrationType.ClientSideREST, 
      PayPalEnvironment.Sandbox, 
      {
        commit: true,
        client: {
          sandbox: 'AX9yH-DFyOn8ILuf6TqA13YZJ1bJeVk39RdSRNWvBxnEwVsfslVbLLnCaSjGtLzjPh5tmM7h3wmn7oMA',
        },
        button: {
          label: 'paypal',
        },
        onPaymentComplete: (data, actions) => {
          //this.payment_id = data.transactions[0].related_resources[0].sale.id;
          this.payment_id = 12345;
          this.isPaymentCompleted = true;
        },
        onCancel: (data, actions) => {
          alert('Sorry you have cancelled the payment, Please try again');
        },
        onError: (err) => {
          alert('Error in processing the payment, Please try again later');
        },
        transactions: [{
          amount: {
            currency: currency,
            total: price
          }
        }]
      });
  }

  closeShop() {
    this.isShopDialogOpen = false;
    this.valid_upto = null;
    this.dedication = null;
    this.searchGraveType = null;
    this.searchGraveNumber = null;
    this.isCandleShopFormVisible = false;
    this.isFlowerShopFormVisible = false;
    this.isStoneShopFormVisible = false;
    this.isOtherShopFormVisible = false;
  }

  openShop(data:any) {
    if(data){
      this.isSelectedGraveNotAvailable = false;
      if(data.selectedGrave && data.selectedGraveName){
        this.selectedGraveId = data.selectedGrave;
        this.selectedGraveName = data.selectedGraveName;
        this.source = 'person-graveyard';
      }
      if(data.selectedAnimal && data.selectedAnimalName){
        this.selectedGraveId = data.selectedAnimal;
        this.selectedGraveName = data.selectedAnimalName;
        this.source = 'animal-graveyard';
      }
      if(data.selectedCatacomb && data.selectedCatacombName){
        this.selectedGraveId = data.selectedCatacomb;
        this.selectedGraveName = data.selectedCatacombName;
        this.source = 'catacomb';
      }
    }
    else{
      this.isSelectedGraveNotAvailable = true;
    }

    this.isShopDialogOpen = true;
  }

  openTab(tabName:string):void{
    this.selectedShopTab = tabName;
    if(tabName == 'tab1'){
      this.options = this._global.refreshObject(this.options, ['type=candle']);
      this.dataService.getAllWithMethodAndOptions('PRICES', this._global.serializeAndURIEncode(this.options))
        .subscribe(data => {
          this.candlePrices = data;
        }
      );
    }
    else if(tabName == 'tab2'){
      this.options = this._global.refreshObject(this.options, ['type=flower']);
      this.dataService.getAllWithMethodAndOptions('PRICES', this._global.serializeAndURIEncode(this.options))
        .subscribe(data => {
            this.flowerPrices = data;
        }
      );
    }
    else if(tabName == 'tab3'){
      this.options = this._global.refreshObject(this.options, ['type=stone']);
      this.dataService.getAllWithMethodAndOptions('PRICES', this._global.serializeAndURIEncode(this.options))
        .subscribe(data => {
          this.stonePrices = data;
        }
      );
    }
    else if(tabName == 'tab4'){
      this.options = this._global.refreshObject(this.options, ['type=other']);
      this.dataService.getAllWithMethodAndOptions('PRICES', this._global.serializeAndURIEncode(this.options))
        .subscribe(data => {
          this.otherPrices = data;
        }
      );
    }
  }

  /* CANDLE SHOPPING */
  selectCandle(candle:any){
    let filename = candle.replace(/^.*[\\\/]/, '');
    this.selectedObjectId = filename.replace(/\.[^/.]+$/, "");
    this.isCandleShopFormVisible = true;
  }

  CandleShoppingChange(){
    this.isCandleShopFormVisible = false;
  }

  onCandleValidUpToDateChange(priceId){
    if(!this.TODAY_DATE)
      return;

    var object = this.candlePrices.filter(price => price.id == priceId)[0];

    this.onObjectValiditySelect(object);
  }

  CandleShoppingConfirm(){
    this.selectedObjectName = 'znicz';

    if(this.isPaymentCompleted)
      this.addObject();
    
  }
  
  /* FLOWER SHOPPING */
  selectFlower(flower:any){
    let filename = flower.replace(/^.*[\\\/]/, '');
    this.selectedObjectId = filename.replace(/\.[^/.]+$/, "");
    this.isFlowerShopFormVisible = true;
  }

  FlowerShoppingChange(){
    this.isFlowerShopFormVisible = false;
  }

  onFlowerValidUpToDateChange(priceId){
    if(!this.TODAY_DATE)
      return;

    var object = this.flowerPrices.filter(price=>price.id == priceId)[0];
    this.onObjectValiditySelect(object);
  }
  
  FlowerShoppingConfirm(){
    this.selectedObjectName = 'kwiat';

    if(this.isPaymentCompleted)
      this.addObject();
  }

  /* STONE SHOPPING */
  selectStone(stone:any){
    let filename = stone.replace(/^.*[\\\/]/, '');
    this.selectedObjectId = filename.replace(/\.[^/.]+$/, "");
    this.isStoneShopFormVisible = true;
  }

  StoneShoppingChange(){
    this.isStoneShopFormVisible = false;
  }

  onStoneValidUpToDateChange(priceId){
    if(!this.TODAY_DATE)
      return;

      var object = this.stonePrices.filter(price=>price.id == priceId)[0];
      this.onObjectValiditySelect(object);
  }

  StoneShoppingConfirm(){
    this.selectedObjectName = 'kamien';

    if(this.isPaymentCompleted)
      this.addObject();
  }
  
  /* OTHER SHOPPING */
  selectOther(card:any){
    let filename = card.replace(/^.*[\\\/]/, '');
    this.selectedObjectId = filename.replace(/\.[^/.]+$/, "");
    this.isOtherShopFormVisible = true;
  }

  OtherShoppingChange(){
    this.isOtherShopFormVisible = false;
  }

  onOtherValidUpToDateChange(priceId){
    if(!this.TODAY_DATE)
      return;

    var object = this.otherPrices.filter(price=>price.id == priceId)[0];
    this.onObjectValiditySelect(object);
  }

  OtherShoppingConfirm(){
    this.selectedObjectName = 'inne';

    if(this.isPaymentCompleted)
      this.addObject();
  }
  addObject(){
    this.isItemAlreadyExists = false;
    let temp = 0;
    if(this.USER_INFO){
      if(this.source == 'person-graveyard'){
        this.options = this._global.refreshObject(this.options, ['payment_method='+this._global.PAYMENT_METHOD,
        'payment_id='+this.payment_id, 'temp='+temp, 'valid_upto='+ this.valid_upto, 
        'user_id='+this.selectedGraveId, 'comment='+this.dedication, 'object_name='+this.selectedObjectName, 
        'object_id='+this.selectedObjectId, 'buyer_id='+this.USER_INFO.buyer_id, 
        'current_language='+this.currentLang, 'method=ADD_PERSON_OBJECT']);
        this.dataService.createWithMethodAndOptions(this.options)
          .subscribe(result => {
            if(result['status'] && result['status'] == 'PERSON_OBJECT_ALREADY_EXISTS'){
              this.isItemAlreadyExists = true;
            }

            this.closeShop();
            this.messageService.sendMessage('RELOAD_PERSON_OBJECTS', {});
          });
      }

      if(this.source == 'animal-graveyard'){
        this.options = this._global.refreshObject(this.options, ['payment_method='+this._global.PAYMENT_METHOD,
        'payment_id='+this.payment_id, 'temp='+temp, 'valid_upto='+ this.valid_upto,
        'animal_id='+this.selectedGraveId, 'comment='+this.dedication, 'object_name='+this.selectedObjectName, 
        'object_id='+this.selectedObjectId, 'buyer_id='+this.USER_INFO.buyer_id, 
        'current_language='+this.currentLang, 'method=ADD_ANIMAL_OBJECT']);
        this.dataService.createWithMethodAndOptions(this.options)
          .subscribe(result => {
            if(result['status'] && result['status'] == 'ANIMAL_OBJECT_ALREADY_EXISTS'){
              this.isItemAlreadyExists = true;
            }
            if(result['status'] && result['status'] == 'ANIMAL_NOT_EXISTS'){
              alert('Animal not exists');
            }
            
            this.closeShop();
            this.messageService.sendMessage('RELOAD_ANIMAL_OBJECTS', {});
          });
      }

      if(this.source == 'catacomb'){
        this.options = this._global.refreshObject(this.options, ['payment_method='+this._global.PAYMENT_METHOD,
        'payment_id='+this.payment_id, 'temp='+temp, 'valid_upto='+ this.valid_upto, 
        'user_id='+this.selectedGraveId, 'comment='+this.dedication, 'object_name='+this.selectedObjectName, 
        'object_id='+this.selectedObjectId, 'buyer_id='+this.USER_INFO.buyer_id, 
        'current_language='+this.currentLang, 'method=ADD_PERSON_OBJECT']);
        this.dataService.createWithMethodAndOptions(this.options)
          .subscribe(result => {
            if(result['status'] && result['status'] == 'PERSON_OBJECT_ALREADY_EXISTS'){
              this.isItemAlreadyExists = true;
            }
            
            this.closeShop();
            this.messageService.sendMessage('RELOAD_CATACOMB_OBJECTS', {});
          });
      }
    }
    else{
      this.messageService.sendMessage('OPEN_LOGIN_DIALOG', {});
    }
  }

  onObjectValiditySelect(priceObject:any){
    let today = moment(this.TODAY_DATE);
    let price = 0, currency = null;

    price = parseFloat(priceObject.price);
    currency = priceObject.currency;

    this.valid_upto = moment(today, "YYYY-MM-DD").add(parseInt(priceObject.days), 'days').format("YYYY-MM-DD");
    this.selectedObjectPrice = price;
    this.selectedObjectCurrency = currency;

    if(this.selectedObjectPrice > 0){
      this.isPaymentCompleted = false;
      this.initPayPalConfig(currency, price);
    }
    else{
      this.payment_id = 0;
      this.isPaymentCompleted = true;
    }
  }
  searchGrave(){
    this.noSearchResult = false;
    if(this.searchGraveType == 'graveyard'){
      this.options = this._global.refreshObject(this.options, ['limit=1', 'position=0', 'user_id='+ this.searchGraveNumber]);
      this.dataService.getAllWithMethodAndOptions('PERSON_DETAILS', this._global.serializeAndURIEncode(this.options))
        .subscribe(result => {
          if(result.length > 0){
            this.source = 'person-graveyard';
            this.selectedGraveId = result[0].user_id;
            this.selectedGraveName = result[0].name1 +' '+result[0].surname;
            this.isSelectedGraveNotAvailable = false;
          }
          else{
            this.noSearchResult = true;
          }
        }
      );
    }
    if(this.searchGraveType == 'catacomb'){
      this.options = this._global.refreshObject(this.options, ['limit=1', 'position=0', 'user_id='+ this.searchGraveNumber]);
      this.dataService.getAllWithMethodAndOptions('PERSON_DETAILS', this._global.serializeAndURIEncode(this.options))
        .subscribe(result => {
          if(result.length > 0){
            this.source = 'catacomb';
            this.selectedGraveId = result[0].user_id;
            this.selectedGraveName = result[0].name1 +' '+result[0].surname;
            this.isSelectedGraveNotAvailable = false;
          }
          else{
            this.noSearchResult = true;
          }
        }
      );
    }
    if(this.searchGraveType == 'pet_graveyard'){
      this.options = this._global.refreshObject(this.options, ['id='+this.searchGraveNumber]);
      this.dataService.getAllWithMethodAndOptions('ANIMAL_DETAILS', this._global.serializeAndURIEncode(this.options))
        .subscribe(result => {
          if(result.length > 0){
            this.source = 'animal-graveyard';
            this.selectedGraveId = result[0].animal_id;
            this.selectedGraveName = result[0].name;
            this.isSelectedGraveNotAvailable = false;
          }
          else{
            this.noSearchResult = true;
          }
        }
      );
    }
  }
}
