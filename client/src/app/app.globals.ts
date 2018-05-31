import { Injectable } from '@angular/core';

@Injectable()
export class AppGlobals {
  private language: string = 'en';

  setLanguage(language:string) {
    this.language = language;
  }

  getLanguage(): string {
    return this.language;
  }
}