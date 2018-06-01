import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {TranslateService} from '@ngx-translate/core';

import { AppGlobals } from '../app.globals';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [AppGlobals]
})
export class HeaderComponent implements OnInit {
  currentComponentText:string = null;

  constructor(private translate: TranslateService, private _global: AppGlobals, private router: Router) { 
    translate.addLangs(['en', 'pl']);
    translate.setDefaultLang('en');
    translate.use('en');
    this._global.setLanguage('en');
  }

  ngOnInit() {
  }

  changeLang(lang: string) {
    this.translate.use(lang);
    this._global.setLanguage(lang);
  }

  openRuote(component:string, routeLink:string){
    this.currentComponentText = component;
    this.router.navigate([routeLink]);
  }
}
