import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserManagementDialogService {
  public isDialogOpen:boolean = false;

  constructor() { }

  getDialogCurrentState(){
    return this.isDialogOpen;
  }

  openDialog(){
    this.isDialogOpen = true;
  }

  closeDialog(){
    this.isDialogOpen = false;
  }
}
