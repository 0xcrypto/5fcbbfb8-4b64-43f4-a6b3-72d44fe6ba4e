import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {TranslateService} from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';

import { AppGlobals } from '../app.globals';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  providers: [AppGlobals]
})
export class HeaderComponent implements OnInit {
  currentComponentText:string = null;
  selectedLanguage:string = null;
  currentRoute:string = null;
  router:Router = null;

  constructor(private translate: TranslateService, private _global: AppGlobals, private _router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.selectedLanguage = this.getSelectedLanguage('en');
    /*this.route.fragment.subscribe((fragment: string) => {
      console.log("My hash fragment is here => ", fragment)
    })
    this.setCurrentRoute();
    */
  }

  changeLanguage(lang:string){
    let app = new AppComponent(this.translate, this._global);
    app.changeLang(lang);
    this.selectedLanguage = this.getSelectedLanguage(lang);
  }

  getSelectedLanguage(lang:string){
    return (lang == 'en') ? 'English' : (lang == 'pl') ? 'Polish' : '';
  }

  openRuote(component:string, routeLink:string){
    this.currentComponentText = component;
    this.router.navigate([routeLink]);
  }
  
  gotoGraveyard(){
    let scene = this._global.getRandomNumber(1,2)+"_"+this._global.getRandomNumber(1,4);
    this.router.navigateByUrl('/graveyard/0/'+scene);
  }

  setCurrentRoute(){
    let key = null;
    debugger;
    if(this.router.url.indexOf('/home') > -1){
      key = 'header.menu.main_gate';
    }
    else if(this.router.url.indexOf('/noticeboard') > -1){
      key = 'header.menu.graveyard_noticeboard';
    }
    else if(this.router.url.indexOf('/graveyard') > -1){
      key = 'header.menu.graveyard';
    }

    if(key){
      this.translate.get(key).subscribe((res: string) => {
        this.currentRoute = res;  
      });
    }
  }
}
