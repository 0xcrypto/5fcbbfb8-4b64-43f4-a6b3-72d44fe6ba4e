import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  selectedCandlePriceString:string;
  selectedStonePriceString:string;
  selectedFlowerPriceString:string;
  selectedOtherPriceString:string;
  selectedObjectPrice:number;
  selectedObjectCurrency:string;
  selectedObjectId:string;
  candlePrice: any;
  flowerPrice: any;
  stonePrice: any;
  otherPrice: any;
  candle_price:string = null;
  flower_price:string = null;
  stone_price:string = null;
  other_price:string = null;
  USER_INFO:any = null;

  constructor(private route: ActivatedRoute, 
    private dataService: DataService, 
    private _global: AppGlobals, 
    private _router: Router,
    private messageService:MessageService,
    private userService:UserService) {
    this.router = _router;
  }

  ngOnInit() {
    this.selectedShopTab = 'tab1';
    this.currentLang = this._global.getLanguage();
    this.userService.castUser.subscribe(user => this.USER_INFO = user);

    this.messageService.castMessage.subscribe(object => {
      let message = object.message;
      let data = object.data;

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
        if(data.length> 0){
          this.candlePrice = data[0];
        }
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

  closeShop() {
    this.isShopDialogOpen = false;
  }

  openShop(data:any) {
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

    this.isShopDialogOpen = true;
  }

  openTab(tabName:string):void{
    this.selectedShopTab = tabName;
    if(tabName == 'tab1'){
      this.options = this._global.refreshObject(this.options, ['type=candle']);
      this.dataService.getAllWithMethodAndOptions('PRICES', this._global.serializeAndURIEncode(this.options))
        .subscribe(data => {
          if(data.length > 0)
            this.candlePrice = data[0];
        }
      );
    }
    else if(tabName == 'tab2'){
      this.options = this._global.refreshObject(this.options, ['type=flower']);
      this.dataService.getAllWithMethodAndOptions('PRICES', this._global.serializeAndURIEncode(this.options))
        .subscribe(data => {
          if(data.length > 0)
            this.flowerPrice = data[0];
        }
      );
    }
    else if(tabName == 'tab3'){
      this.options = this._global.refreshObject(this.options, ['type=stone']);
      this.dataService.getAllWithMethodAndOptions('PRICES', this._global.serializeAndURIEncode(this.options))
        .subscribe(data => {
          if(data.length > 0)
          this.stonePrice = data[0];
        }
      );
    }
    else if(tabName == 'tab4'){
      this.options = this._global.refreshObject(this.options, ['type=other']);
      this.dataService.getAllWithMethodAndOptions('PRICES', this._global.serializeAndURIEncode(this.options))
        .subscribe(data => {
          if(data.length > 0)
          this.otherPrice = data[0];
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

  onCandleValidUpToDateChange(event, object:any){
    if(!this.TODAY_DATE)
      return;

    let today = moment(this.TODAY_DATE);
    let validity = moment(this.valid_upto);
    let diffDays = validity.diff(today, 'days'); 
    let totalAmount = ((diffDays - 1) > 0) ? parseFloat(object.price) * (diffDays - 1) : 0;
    this.selectedObjectPrice = totalAmount;
    this.selectedObjectCurrency = object.currency;
    let price_string = (this.currentLang == 'en') ? object.desc_en : object.desc_pl; 
    this.selectedCandlePriceString = price_string.replace('_TOTAL_', totalAmount).replace('_PRICE_', object.price)
    .replace('_CURRENCY_', object.currency).replace('_CURRENCY_', object.currency);
  }

  CandleShoppingConfirm(){
    let object_name = 'znicz';
    let payment_id = '12345';
    let temp = 0;
    this.addObject(payment_id, temp, object_name);
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

  onFlowerValidUpToDateChange(event, object:any){
    if(!this.TODAY_DATE)
      return;

    let today = moment(this.TODAY_DATE);
    let validity = moment(this.valid_upto);
    let diffDays = validity.diff(today, 'days'); 
    let totalAmount = ((diffDays - 1) > 0) ? parseFloat(object.price) * (diffDays - 1) : 0;
    this.selectedObjectPrice = totalAmount;
    this.selectedObjectCurrency = object.currency;
    let price_string = (this.currentLang == 'en') ? object.desc_en : object.desc_pl; 
    this.selectedFlowerPriceString = price_string.replace('_TOTAL_', totalAmount).replace('_PRICE_', object.price)
    .replace('_CURRENCY_', object.currency).replace('_CURRENCY_', object.currency);
  }
  
  FlowerShoppingConfirm(){
    let object_name = 'kwiat';
    let payment_id = '12345';
    let temp = 0;
    this.addObject(payment_id, temp, object_name);
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
  onStoneValidUpToDateChange(event, object:any){
    if(!this.TODAY_DATE)
      return;

    let today = moment(this.TODAY_DATE);
    let validity = moment(this.valid_upto);
    let diffDays = validity.diff(today, 'days'); 
    let totalAmount = ((diffDays - 1) > 0) ? parseFloat(object.price) * (diffDays - 1) : 0;
    this.selectedObjectPrice = totalAmount;
    this.selectedObjectCurrency = object.currency;
    let price_string = (this.currentLang == 'en') ? object.desc_en : object.desc_pl; 
    this.selectedStonePriceString = price_string.replace('_TOTAL_', totalAmount).replace('_PRICE_', object.price)
    .replace('_CURRENCY_', object.currency).replace('_CURRENCY_', object.currency);
  }
  StoneShoppingConfirm(){
    let object_name = 'kamien';
    let payment_id = '12345';
    let temp = 0;
    this.addObject(payment_id, temp, object_name);
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
  onOtherValidUpToDateChange(event, object:any){
    if(!this.TODAY_DATE)
      return;

    let today = moment(this.TODAY_DATE);
    let validity = moment(this.valid_upto);
    let diffDays = validity.diff(today, 'days'); 
    let totalAmount = ((diffDays - 1) > 0) ? parseFloat(object.price) * (diffDays - 1) : 0;
    this.selectedObjectPrice = totalAmount;
    this.selectedObjectCurrency = object.currency;
    let price_string = (this.currentLang == 'en') ? object.desc_en : object.desc_pl; 
    this.selectedOtherPriceString = price_string.replace('_TOTAL_', totalAmount).replace('_PRICE_', object.price)
    .replace('_CURRENCY_', object.currency).replace('_CURRENCY_', object.currency);
  }
  OtherShoppingConfirm(){
    let object_name = 'inne';
    let payment_id = '12345';
    let temp = 0;
    this.addObject(payment_id, temp, object_name);
  }
  addObject(payment_id:string, temp:number, object_name:string){
    if(this.USER_INFO){
      if(this.source == 'person-graveyard'){
        this.options = this._global.refreshObject(this.options, ['payment_method='+this._global.PAYMENT_METHOD,
        'payment_id='+payment_id, 'temp='+temp, 'valid_upto='+ this.valid_upto, 
        'user_id='+this.selectedGraveId, 'comment='+this.dedication, 'object_name='+object_name, 
        'object_id='+this.selectedObjectId, 'buyer_id='+this.USER_INFO.buyer_id, 
        'current_language='+this.currentLang, 'method=ADD_PERSON_OBJECT']);
        this.dataService.createWithMethodAndOptions(this.options)
          .subscribe(result => {
            if(result['status'] && result['status'] == 'ANIMAL_OBJECT_ALREADY_EXISTS'){
              alert('Item already exists');  
            }
            if(result['status'] && result['status'] == 'ANIMAL_NOT_EXISTS'){
              alert('Animal not exists');
            }
            
            this.closeShop();
            this.messageService.sendMessage('RELOAD_PERSON_OBJECTS', {});
          });
      }

      if(this.source == 'animal-graveyard'){
        this.options = this._global.refreshObject(this.options, ['payment_method='+this._global.PAYMENT_METHOD,
        'payment_id='+payment_id, 'temp='+temp, 'valid_upto='+ this.valid_upto,
        'animal_id='+this.selectedGraveId, 'comment='+this.dedication, 'object_name='+object_name, 
        'object_id='+this.selectedObjectId, 'buyer_id='+this.USER_INFO.buyer_id, 
        'current_language='+this.currentLang, 'method=ADD_ANIMAL_OBJECT']);
        this.dataService.createWithMethodAndOptions(this.options)
          .subscribe(result => {
            if(result['status'] && result['status'] == 'PERSON_OBJECT_ALREADY_EXISTS'){
              alert('Item already exists');  
            }
            
            this.closeShop();
            this.messageService.sendMessage('RELOAD_ANIMAL_OBJECTS', {});
          });
      }
      
    }
    else{
      this.messageService.sendMessage('OPEN_LOGIN_DIALOG', {});
    }
  }
}
