import { Component } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import { AppGlobals } from './app.globals';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [AppGlobals]
})
export class AppComponent {
  
  constructor(private translate: TranslateService, private _global: AppGlobals) {
    translate.addLangs(['en', 'pl']);
    translate.setDefaultLang('en');
    translate.use('en');
    this._global.setLanguage('en');
  }

  changeLang(lang: string) {
    this.translate.use(lang);
    this._global.setLanguage(lang);
  }
}
