import { Component, OnInit } from '@angular/core';
import { DialogService } from '../services/dialog.service';
import { DataService } from '../services/data.service';
import { Router } from '@angular/router';
import { AppGlobals } from '../app.globals';
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
  private phone:string = null;
  private isGuest:boolean = true;
  private loggedInUser:any = [];
  router:Router = null;
  options: Options = null;
  private loginFormError = null;

  constructor(private _dialog:DialogService, 
    private _router: Router, 
    private dataService: DataService, 
    private _global: AppGlobals,
    private localStorageService: LocalStorageService,
    private userService:UserService
    ) { 
      this.router = _router;
  }

  ngOnInit() {
  }

  closeButtonClick(){
    this._dialog.closeDialog();
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
    this.dataService.getAllWithMethodAndOptions('LOGIN', 
    this._global.serializeAndURIEncode(this.options))
    .subscribe(result => {
      if(result['status'] && result['status'] == "LOGIN_NOT_FOUND")
        this.loginFormError = 'Email & Password not exists in system';
      else{
        this.userService.logIn(result['buyer']);
        this._dialog.closeDialog();
      }
    });
  }

  register(){

  }
  
  forgotpassword(){
    
  }
}
