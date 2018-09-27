import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

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
  firstname:string = null;
  lastname:string = null;
  dedication:string = null;
  amount:number = 10;
  currency:string = 'EUR';
  currentLang:string = null;
  isCandleShopFormVisible:boolean = false;
  isFlowerShopFormVisible:boolean = false;
  isStoneShopFormVisible:boolean = false;
  isOtherShopFormVisible:boolean = false;
  selectedObjectPrice:number;
  selectedObjectCurrency:string;
  selectedObjectExpiryInDays:string;
  selectedObjectId:string;
  candle_prices: any[] = [];
  flower_prices: any[] = [];
  stone_prices: any[] = [];
  other_prices: any[] = [];
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

    this.options = this._global.refreshObject(this.options, ['type=candle']);
    this.dataService.getAllWithMethodAndOptions('PRICES', this._global.serializeAndURIEncode(this.options))
      .subscribe(data => {
        this.candle_prices = data;
      }
    );

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
    if(data){
      this.selectedGraveId = data.selectedGrave;
      this.selectedGraveName = data.selectedGraveName;
    }

    this.isShopDialogOpen = true;
  }

  openTab(tabName:string):void{
    this.selectedShopTab = tabName;
    if(tabName == 'tab1'){
      this.options = this._global.refreshObject(this.options, ['type=candle']);
      this.dataService.getAllWithMethodAndOptions('PRICES', this._global.serializeAndURIEncode(this.options))
        .subscribe(data => {
          this.candle_prices = data;
        }
      );
    }
    else if(tabName == 'tab2'){
      this.options = this._global.refreshObject(this.options, ['type=flower']);
      this.dataService.getAllWithMethodAndOptions('PRICES', this._global.serializeAndURIEncode(this.options))
        .subscribe(data => {
          this.flower_prices = data;
        }
      );
    }
    else if(tabName == 'tab3'){
      this.options = this._global.refreshObject(this.options, ['type=stone']);
      this.dataService.getAllWithMethodAndOptions('PRICES', this._global.serializeAndURIEncode(this.options))
        .subscribe(data => {
          this.stone_prices = data;
        }
      );
    }
    else if(tabName == 'tab4'){
      this.options = this._global.refreshObject(this.options, ['type=other']);
      this.dataService.getAllWithMethodAndOptions('PRICES', this._global.serializeAndURIEncode(this.options))
        .subscribe(data => {
          this.other_prices = data;
        }
      );
    }
  }

  CandleShoppingChange(){
    this.isCandleShopFormVisible = false;
  }
  FlowerShoppingChange(){
    this.isFlowerShopFormVisible = false;
  }
  StoneShoppingChange(){
    this.isStoneShopFormVisible = false;
  }
  OtherShoppingChange(){
    this.isOtherShopFormVisible = false;
  }
  selectCandle(candle:any){
    let filename = candle.replace(/^.*[\\\/]/, '');
    this.selectedObjectId = filename.replace(/\.[^/.]+$/, "");
    this.isCandleShopFormVisible = true;
  }
  CandleShoppingConfirm(){
    let payment_id = '12345';
    let temp = 0;
    let object_name = 'znicz';
    if(this.USER_INFO){
      this.options = this._global.refreshObject(this.options, ['payment_method='+this._global.PAYMENT_METHOD,
      'payment_id='+payment_id, 'temp='+temp, 'valid_upto='+ this.selectedObjectExpiryInDays, 
      'user_id='+this.selectedGraveId, 'comment='+this.dedication, 'object_name='+object_name, 
      'object_id='+this.selectedObjectId, 'buyer_id='+this.USER_INFO.buyer_id, 
      'current_language='+this.currentLang, 'method=ADD_PERSON_OBJECT']);
      this.dataService.createWithMethodAndOptions(this.options)
        .subscribe(result => {
          if(result['status'] && result['status'] == 'PERSON_OBJECT_ALREADY_EXISTS'){
            alert('item already added');
          }
          else{
            this.closeShop();
            this.messageService.sendMessage('RELOAD_PERSON_OBJECTS', {});
          }
        });
    }
    else{
      this.messageService.sendMessage('OPEN_LOGIN_DIALOG', {});
    }
  }
  selectFlower(flower:any){
    debugger;
    this.isFlowerShopFormVisible = true;
  }
  FlowerShoppingConfirm(){
    let object_name = 'kwiat';
  }
  selectStone(stone:any){
    debugger;
    this.isStoneShopFormVisible = true;
  }
  StoneShoppingConfirm(){
    let object_name = 'kamien';
  }
  selectOther(card:any){
    debugger;
    this.isOtherShopFormVisible = true;
  }
  OtherShoppingConfirm(){
    let object_name = 'inne';
  }
  onCandlePriceGroupSelect(object:any){
    debugger;
    this.selectedObjectPrice = object.price;
    this.selectedObjectCurrency = object.currency;
    this.selectedObjectExpiryInDays = (object.expire_in_days == 'FOREVER') ? 100000 : object.expire_in_days;
  }
  onFlowerPriceGroupSelect(object:any){
    this.selectedObjectPrice = object.price;
    this.selectedObjectCurrency = object.currency;
    this.selectedObjectExpiryInDays = (object.expire_in_days == 'FOREVER') ? 100000 : object.expire_in_days;
  }
  onStonePriceGroupSelect(object:any){
    this.selectedObjectPrice = object.price;
    this.selectedObjectCurrency = object.currency;
    this.selectedObjectExpiryInDays = (object.expire_in_days == 'FOREVER') ? 100000 : object.expire_in_days;
  }
  onOtherPriceGroupSelect(object:any){
    this.selectedObjectPrice = object.price;
    this.selectedObjectCurrency = object.currency;
    this.selectedObjectExpiryInDays = (object.expire_in_days == 'FOREVER') ? 100000 : object.expire_in_days;
  }
}
