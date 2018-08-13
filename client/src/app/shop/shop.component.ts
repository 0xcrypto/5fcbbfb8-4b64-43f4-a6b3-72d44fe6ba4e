import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { DataService } from '../services/data.service';
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

  constructor(private route: ActivatedRoute, private dataService: DataService, private _global: AppGlobals, private _router: Router) {
    this.router = _router;
  }

  ngOnInit() {
    this.selectedShopTab = 'tab1';

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

  openShop() {
    this.isShopDialogOpen = true;
  }

  openTab(tabName:string):void{
    this.selectedShopTab = tabName;
  }
}
