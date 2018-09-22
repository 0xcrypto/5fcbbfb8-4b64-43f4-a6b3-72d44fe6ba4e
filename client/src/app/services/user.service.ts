import { Injectable } from '@angular/core';
import { BehaviorSubject  } from 'rxjs';
import { CookieStorage, LocalStorage, SessionStorage, LocalStorageService } from 'ngx-store';
import { AppGlobals } from '../app.globals';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private USER = new BehaviorSubject<any>(null);
  castUser = this.USER.asObservable();
  
  private IS_GUEST = new BehaviorSubject<string>('YES');
  castIsGuest = this.IS_GUEST.asObservable();

  constructor(private localStorageService:LocalStorageService, private _global: AppGlobals) {
    if(this.localStorageService.get(this._global.IS_GUEST_KEY)){
      this.setIsGuest(this.localStorageService.get(this._global.IS_GUEST_KEY));
    }
    
    if(this.localStorageService.get(this._global.USER_INFO_KEY)){
      this.setUser(this.localStorageService.get(this._global.USER_INFO_KEY));
    }
  }

  setUser(user){
    this.USER.next(user);
  }

  setIsGuest(is_guest){
    this.IS_GUEST.next(is_guest);
  }
  logIn(user:any){
    this.localStorageService.set(this._global.IS_GUEST_KEY, 'NO');
    this.localStorageService.set(this._global.USER_INFO_KEY, user);
    this.setUser(user);
    this.setIsGuest('NO');
  }

  logOut(){
    this.localStorageService.set(this._global.IS_GUEST_KEY, 'YES');
    this.localStorageService.set(this._global.USER_INFO_KEY, null);
    this.setUser(null);
    this.setIsGuest('YES');
  }
}
