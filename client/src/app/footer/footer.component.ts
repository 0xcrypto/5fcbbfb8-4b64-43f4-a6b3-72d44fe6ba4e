import { Component, OnInit } from '@angular/core';

import { AppGlobals } from '../app.globals';
import { DataService } from '../services/data.service';

export interface Options {
};

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  providers: [AppGlobals]
})
export class FooterComponent implements OnInit {
  menus: any[] = [];
  language: string = null;
  options: Options = null;

  constructor(private dataService: DataService, private _global: AppGlobals) {
  }

  ngOnInit() {
    this.getMenus();
    this.language = this._global.getLanguage();
  }

  getMenus(): void {
    this.options = this._global.refreshObject(this.options, []);
    this.dataService.getAllWithMethodAndOptions('FOOTER_MENUS', this._global.serializeAndURIEncode(this.options))
      .subscribe(result => {
        this.menus = result;
      });
  }

}
