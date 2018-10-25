import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable()
export class MessageService {
  private message = new BehaviorSubject<any>({});
  castMessage = this.message.asObservable();

  sendMessage(message: string, data:any, callback: any = null) {
      this.message.next({message: message, data: data, callback: callback});
  }

  clearMessage() {
      this.message.next({});
  }

  getMessage(): Observable<any> {
      return this.castMessage;
  }
}