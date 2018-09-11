import { Component, OnInit } from '@angular/core';
import { DialogService } from '../services/dialog.service';

@Component({
  selector: 'app-user-mgt',
  templateUrl: './user-mgt.component.html'
})
export class UserMgtComponent implements OnInit {
  private currentContent:string = 'login';
  private email:string = null;
  private password:string = null;

  constructor(private _dialog:DialogService) { }

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

  }

  register(){

  }
  
  forgotpassword(){
    
  }
}
