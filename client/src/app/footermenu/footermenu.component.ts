import { Component, OnInit } from '@angular/core';

import { AppGlobals } from '../app.globals';
import { FooterMenu } from '../classes/footermenu';
import { FooterMenuService } from '../services/footer-menu.service';

@Component({
  selector: 'app-footermenu',
  templateUrl: './footermenu.component.html',
  styleUrls: ['./footermenu.component.css'],
  providers: [AppGlobals]
})
export class FootermenuComponent implements OnInit {
  menus: FooterMenu[] = [];
  language: string = null;

  constructor(private footermenuService: FooterMenuService, private _global: AppGlobals) {
  }

  ngOnInit() {
    this.getMenus();
    this.language = this._global.getLanguage();
  }

  getMenus(): void {
    this.footermenuService.getAll()
      .subscribe(result => this.menus = result);
  }

}
