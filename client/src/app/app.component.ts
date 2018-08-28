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
  private CURRENT_LANGUAGE: string = null;

  constructor(private translate: TranslateService, private _global: AppGlobals) {
    translate.addLangs(this._global.LANGUAGES);
    let lang = this._global.getLanguage();
    translate.setDefaultLang(lang);
    translate.use(lang);
  }

  changeLang(lang:string){
    this._global.setLanguage(lang);
    this.translate.use(lang);
  }
}
