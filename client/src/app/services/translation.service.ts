import { Injectable } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private translations: any[] = [
    { key: 'RESET_PASSWORD_LOGIN_NOT_FOUND', value: 'forgot_password.login_not_found'}, 
    { key: 'RESET_PASSWORD_SUCCESS', value: 'forgot_password.reset_password_success'}, 
    { key: 'REGISTER_PASSWORD_NOT_MATCHED', value: 'register.password_not_matched'}, 
    { key: 'REGISTER_LOGIN_EXISTS', value: 'register.login_exists'}, 
    { key: 'REGISTER_SUCCESS', value: 'register.success'}, 
    { key: 'REGISTER_ERROR', value: 'register.error'}, 
    { key: 'REGISTER_ACCEPT_TERMS', value: 'register.accept_terms'},
    { key: 'PLEASE_PROVIDE_FIRSTNAME', value: 'custom_dialog.please_provide_firstname'},
    { key: 'PLEASE_PROVIDE_LASTNAME', value: 'custom_dialog.please_provide_lastname'},
    { key: 'PLEASE_PROVIDE_DOB', value: 'please_provide_dob'},
    { key: 'PLEASE_PROVIDE_DOD', value: 'custom_dialog.please_provide_dod'},
    { key: 'PLEASE_PROVIDE_GENDER', value: 'custom_dialog.please_select_gender'},
    { key: 'PLEASE_SELECT_PERSON_BURIAL_TYPE', value: 'custom_dialog.please_select_graveyard_burial_type'},
    { key: 'PLEASE_SELECT_PERSON_BURIAL_SUB_TYPE', value: 'custom_dialog.please_select_graveyard_burial_sub_type'},
    { key: 'PERSON_ALREADY_EXISTS', value: 'custom_dialog.person_already_exists'}
];

  constructor(private translateService: TranslateService) { }

  getTranslatedString(key:string):string{
    let translatedString = null;
    var translation = this.translations.filter(translation => translation.key == key )[0];
    var translationKey = translation.value;
      this.translateService.get(translationKey).subscribe((result: string) => {
        translatedString = result;
    });
    return translatedString;
  }
}
