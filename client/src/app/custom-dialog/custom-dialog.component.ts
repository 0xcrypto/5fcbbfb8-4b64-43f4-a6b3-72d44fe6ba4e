import { Component, OnInit } from '@angular/core';
import { MessageService } from '../services/message.service';
import { TranslationService } from '../services/translation.service';

@Component({
  selector: 'app-custom-dialog',
  templateUrl: './custom-dialog.component.html'
})
export class CustomDialogComponent implements OnInit {
  public isOpen:boolean = false;
  public message:string;
  public callback: any;

  constructor(private messageService:MessageService,
    private translation:TranslationService) { }

  ngOnInit() {
    this.messageService.castMessage.subscribe(object => {
      let message= object.message;
      let data = object.data;

      switch(message){
        case "OPEN_CUSTOM_DIALOG":
          this.callback = object.callback ? object.callback : null;
          this.setMessage(this.translation.getTranslatedString(data.translationKey));
          this.open();
          break;
      }
    });
  }

  getCurrentState(){
    return this.isOpen;
  }

  setMessage(_message:string){
    this.message = _message;
  }
  
  open(){
    this.isOpen = true;
  }

  close(){
    this.isOpen = false;

    if(this.callback){
      this.callback();
    }
  }
}
