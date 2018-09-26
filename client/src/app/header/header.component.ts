import { Component, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {TranslateService} from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';

import { AppGlobals } from '../app.globals';
import { AppComponent } from '../app.component';
import { DialogService } from '../services/dialog.service';
import { UserService } from '../services/user.service';
import { User } from '../classes/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  providers: [AppGlobals]
})
export class HeaderComponent implements OnInit {
  currentComponentText:string = null;
  selectedLanguage:string = null;
  currentRoute:string = null;
  isUserMgtDialogOpen:boolean = false;
  loggedInUserFullName:string = null;
  USER_INFO:any = null;
  IS_GUEST:string = null;

  constructor(private translate: TranslateService,
    private _global: AppGlobals, 
    private _router: Router, 
    private route: ActivatedRoute,
    private _dialog:DialogService,
    private userService:UserService) {
  }

  ngOnInit() {
    this.selectedLanguage = this.getSelectedLanguage();
    this.userService.castUser.subscribe(user => this.USER_INFO = user);
    this.userService.castIsGuest.subscribe(is_guest => this.IS_GUEST = is_guest);
  }

  changeLanguage(lang:string){
    let app = new AppComponent(this.translate, this._global);
    app.changeLang(lang);
    this.selectedLanguage = this.getSelectedLanguage();
  }

  getSelectedLanguage(){
    var language = this._global.getLanguage();
    if(language == this._global.LANGUAGES[0])
      return 'English';
    else if(language == this._global.LANGUAGES[1])
      return 'Polish';
    else
      return null;
  }

  openRuote(component:string, routeLink:string){
    this.currentComponentText = component;
    this._router.navigate([routeLink]);
  }
  
  gotoGraveyard(){
    let scene = this._global.getRandomNumber(1,2)+"_"+this._global.getRandomNumber(1,4);
    this._router.navigateByUrl('/graveyard/0/'+scene);
  }

  gotoPetGraveyard(){
    let scene = this._global.getRandomNumber(1,2)+"_"+this._global.getRandomNumber(1,4);
    this._router.navigateByUrl('/pet-graveyard/0/'+scene);
  }

  openUserMgtDialog(){
    this._dialog.openDialog();
  }

  logOut(){
    this.userService.logOut();
  }

  setCurrentRoute(){
    let key = null;
    if(this._router.url.indexOf('/home') > -1){
      key = 'header.menu.main_gate';
    }
    else if(this._router.url.indexOf('/noticeboard') > -1){
      key = 'header.menu.graveyard_noticeboard';
    }
    else if(this._router.url.indexOf('/graveyard') > -1){
      key = 'header.menu.graveyard';
    }

    if(key){
      this.translate.get(key).subscribe((res: string) => {
        this.currentRoute = res;  
      });
    }
  }
}
