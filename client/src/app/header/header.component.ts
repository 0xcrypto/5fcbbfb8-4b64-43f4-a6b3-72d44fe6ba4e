import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {TranslateService} from '@ngx-translate/core';

import { AppGlobals } from '../app.globals';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  providers: [AppGlobals]
})
export class HeaderComponent implements OnInit {
  currentComponentText:string = null;

  constructor(private translate: TranslateService, private _global: AppGlobals, private router: Router) {}

  ngOnInit() {}

  changeLanguage(lang:string){
    let app = new AppComponent(this.translate, this._global);
    app.changeLang(lang);
  }

  openRuote(component:string, routeLink:string){
    this.currentComponentText = component;
    this.router.navigate([routeLink]);
  }
  
  gotoGraveyard(){
    let scene = this._global.getRandomNumber(1,2)+"_"+this._global.getRandomNumber(1,4);
    this.router.navigateByUrl('/graveyard/0/'+scene);
  }
}
