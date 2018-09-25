import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { DataService } from '../services/data.service';
import { UserService } from '../services/user.service';
import { AppGlobals } from '../app.globals';

export interface Options {};
@Component({
  selector: 'app-account',
  templateUrl: './account.component.html'
})
export class AccountComponent implements OnInit {
  firstname:string = null;
  lastname:string = null;
  email:string = null;
  phone:string = null;
  new_password:string = null;
  repeat_password:string = null;
  router:Router = null;
  options:Options = {};
  isAccountDialogOpen:boolean = false;
  loadingDeceadedData:boolean = false;
  loadingGravesData:boolean = false;
  loadingPetsData:boolean = false;
  selectedAccountTab:string = null;

  constructor(private route: ActivatedRoute, 
    private dataService: DataService, 
    private userService: UserService, 
    private _global: AppGlobals, 
    private _router: Router) {
    this.router = _router;
  }

  ngOnInit() {
    this.selectedAccountTab = 'tab1';
    this.userService.castUser.subscribe(user => {
      this.firstname = user.name ? user.name : null;
      this.lastname = user.surname ? user.surname : null;
      this.email = user.email ? user.email : null;
      this.phone = user.phone ? user.phone : null;
    });
  }

  closeAccountDialog() {
    this.isAccountDialogOpen = false;
  }

  openAccountDialog() {
    this.isAccountDialogOpen = true;
  }

  openTab(tabName:string):void{
    this.selectedAccountTab = tabName;
  }

  saveProfile(){

  }
}
