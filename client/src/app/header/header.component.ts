import { Component, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {TranslateService} from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';

import { AppGlobals } from '../app.globals';
import { AppComponent } from '../app.component';
import { UserManagementDialogService } from '../services/userManagementDialog.service';
import { UserService } from '../services/user.service';
import { MessageService } from '../services/message.service';
import { ImageService } from '../services/image.service';
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
    private _userMgtDialog:UserManagementDialogService,
    private messageService:MessageService,
    private imageService:ImageService,
    private userService:UserService) {
  }

  ngOnInit() {
    this.selectedLanguage = this.getSelectedLanguage();
    this.userService.castUser.subscribe(user => this.USER_INFO = user);
    this.userService.castIsGuest.subscribe(is_guest => this.IS_GUEST = is_guest);

    this.messageService.castMessage.subscribe(object => {
      let message = object.message;

      switch(message){
        case "OPEN_LOGIN_DIALOG":
          this.openUserMgtDialog();
          break;
      }
    });
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
  
  openGraveyard(){
    this._global.CURRENT_PAGE = 'header.menu.graveyard'; 
    this._router.navigateByUrl('/graveyard/0');
  }

  openPetGraveyard(){
    this._global.CURRENT_PAGE = 'header.menu.pet_graveyard';
    this._router.navigateByUrl('/pet-graveyard/0');
  }

  openPetGraveyardNoticeboard(){
    this._global.CURRENT_PAGE = 'header.menu.pet_graveyard_noticeboard';  
    this._router.navigateByUrl('/pet-noticeboard');
  }

  openCatacomb(){
    this._global.CURRENT_PAGE = 'header.menu.catacomb';  
    this._router.navigateByUrl('/catacomb');
  }

  openMainGate(){
    this._global.CURRENT_PAGE = 'header.menu.main_gate';
    this._router.navigateByUrl('/home');
  }

  openNoticeboard(){
    this._global.CURRENT_PAGE = 'header.menu.graveyard_noticeboard';  
    this._router.navigateByUrl('/noticeboard');
  }
  
  openUserMgtDialog(){
    this._userMgtDialog.openDialog();
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
