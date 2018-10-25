import { Component, OnInit } from '@angular/core';
import { UserManagementDialogService } from '../services/userManagementDialog.service';
import { DataService } from '../services/data.service';
import { Router } from '@angular/router';
import { AppGlobals } from '../app.globals';
import { TranslationService } from '../services/translation.service';
import { MessageService } from '../services/message.service';
import { CookieStorage, LocalStorage, SessionStorage, LocalStorageService } from 'ngx-store';
import { UserService } from '../services/user.service';

export interface Options {};

@Component({
  selector: 'app-user-mgt',
  templateUrl: './user-mgt.component.html'
})
export class UserMgtComponent implements OnInit {
  private currentContent:string = 'login';
  private email:string = null;
  private password:string = null;
  private confirm_password:string = null;
  private firstname:string = null;
  private lastname:string = null;
  private terms_and_conditions:boolean = false;
  private phone:string = null;
  private isGuest:boolean = true;
  private loggedInUser:any = [];
  router:Router = null;
  options: Options = null;

  constructor(private _userMgtDialog:UserManagementDialogService, 
    private _router: Router, 
    private dataService: DataService, 
    private _global: AppGlobals,
    private localStorageService: LocalStorageService,
    private userService:UserService,
    private messageService:MessageService,
    private translation:TranslationService
    ) { 
      this.router = _router;
  }

  ngOnInit() {
  }

  closeButtonClick(){
    this._userMgtDialog.closeDialog();
  }

  openLogin(){
    this.currentContent = 'login'
  }

  openRegister(){
    this.currentContent = 'register'
  }

  openForgotPassword(){
    this.currentContent = 'forgot-password'
  }

  login(){
    let parameters = ['password='+this.password, 'username='+this.email];
    this.options = this._global.refreshObject(this.options, parameters);
    this.dataService.getAllWithMethodAndOptions('LOGIN', this._global.serializeAndURIEncode(this.options))
    .subscribe(result => {
      if(result['status'] && result['status'] == "LOGIN_NOT_FOUND"){
        this.messageService.sendMessage('OPEN_CUSTOM_DIALOG', {'translationKey': 'USERNAME_PASSWORD_NOT_FOUND' });
      }
      else{
        this.userService.logIn(result['buyer']);
        this._userMgtDialog.closeDialog();
      }
    });
  }

  register(){
    if(this.password != this.confirm_password){
      this.messageService.sendMessage('OPEN_CUSTOM_DIALOG', {'translationKey': 'REGISTER_PASSWORD_NOT_MATCHED' });
      return;
    }
    if(!this.terms_and_conditions){
      this.messageService.sendMessage('OPEN_CUSTOM_DIALOG', {'translationKey': 'REGISTER_ACCEPT_TERMS' });
      return;
    }

    this.options = this._global.refreshObject(this.options, ['firstname='+this.firstname,
     'lastname='+this.lastname, 'email='+this.email, 'username='+this.email, 
     'phone='+this.phone, 'password='+this.password, 'method=REGISTER']);
    this.dataService.createWithMethodAndOptions(this.options)
      .subscribe(result => {
        if(result){
          if(result['status'] == 'LOGIN_ALREADY_EXISTS'){
            this.messageService.sendMessage('OPEN_CUSTOM_DIALOG', {'translationKey': 'REGISTER_LOGIN_EXISTS' });
            return;
          }
          else if(result['status'] == 'ERROR'){
            this.messageService.sendMessage('OPEN_CUSTOM_DIALOG', {'translationKey': 'REGISTER_ERROR' });
            return;
          }
          else{
            this.messageService.sendMessage('OPEN_CUSTOM_DIALOG', {'translationKey': 'REGISTER_SUCCESS' });
            return;
          }
        }
      });
  }
  
  forgotpassword(){
    this.options = this._global.refreshObject(this.options, ['email='+this.email,
     'method=RESET_PASSWORD']);
    this.dataService.createWithMethodAndOptions(this.options)
      .subscribe(result => {
        if(result){
          if(result['status'] == 'LOGIN_NOT_FOUND'){
            this.messageService.sendMessage('OPEN_CUSTOM_DIALOG', {'translationKey': 'RESET_PASSWORD_LOGIN_NOT_FOUND' });
            return;
          }
          else{
            this.messageService.sendMessage('OPEN_CUSTOM_DIALOG', {'translationKey': 'RESET_PASSWORD_SUCCESS' });
            return;
          }
        }
      });
  }
}
