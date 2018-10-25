import { Injectable } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private translations: any[] = [
    { key: 'PLEASE_SELECT_BURIAL_TYPE', value: 'custom_dialog.please_select_burial_type'},
    { key: 'PLEASE_SELECT_BURIAL_SUB_TYPE', value: 'custom_dialog.please_select_burial_sub_type'},
    { key: 'PLEASE_SELECT_RESERVATION_TYPE', value: 'custom_dialog.please_select_reservation_type'},
    { key: 'PLEASE_SELECT_RESERVATION_SUB_TYPE', value: 'custom_dialog.please_select_reservation_sub_type'},
    { key: 'PLEASE_SELECT_STONE', value: 'custom_dialog.please_select_stone'},
    { key: 'PLEASE_PROVIDE_FIRSTNAME', value: 'custom_dialog.please_provide_firstname'},
    { key: 'PLEASE_PROVIDE_LASTNAME', value: 'custom_dialog.please_provide_lastname'},
    { key: 'PLEASE_PROVIDE_DOB', value: 'custom_dialog.please_provide_dob'},
    { key: 'PLEASE_PROVIDE_DOD', value: 'custom_dialog.please_provide_dod'},
    { key: 'PLEASE_SELECT_GENDER', value: 'custom_dialog.please_select_gender'},
    { key: 'PLEASE_SELECT_RELIGION', value: 'custom_dialog.please_select_religion'},
    { key: 'PLEASE_PROVIDE_IN_MEMORIAM', value: 'custom_dialog.please_provide_memoriam'},
    { key: 'PLEASE_PROVIDE_SIGNATURE', value: 'custom_dialog.please_provide_signature'},
    { key: 'BURIAL_DONE_SUCCESSFULLY', value: 'custom_dialog.burial_done_successfully'},
    { key: 'RESERVATION_DONE_SUCCESSFULLY', value: 'custom_dialog.reservation_done_successfully'},
    { key: 'DETAILS_ALREADY_EXISTS', value: 'custom_dialog.details_already_exists'},
    { key: 'PLEASE_PROVIDE_PETNAME', value: 'custom_dialog.please_provide_pet_name'},
    { key: 'PLEASE_PROVIDE_GENUS', value: 'custom_dialog.please_provide_genus'},
    { key: 'PLEASE_PROVIDE_PET_TYPE', value: 'custom_dialog.please_provide_pet_type'},
    { key: 'PLEASE_PROVIDE_OWNER_FIRSTNAME', value: 'custom_dialog.please_provide_owner_firstname'},
    { key: 'PLEASE_PROVIDE_OWNER_LASTNAME', value: 'custom_dialog.please_provide_owner_lastname'},
    { key: 'USERNAME_PASSWORD_NOT_FOUND', value: 'login.username_password_not_found'}, 
    { key: 'RESET_PASSWORD_LOGIN_NOT_FOUND', value: 'forgot_password.login_not_found'}, 
    { key: 'RESET_PASSWORD_SUCCESS', value: 'forgot_password.reset_password_success'}, 
    { key: 'REGISTER_PASSWORD_NOT_MATCHED', value: 'register.password_not_matched'}, 
    { key: 'REGISTER_LOGIN_EXISTS', value: 'register.login_exists'}, 
    { key: 'REGISTER_SUCCESS', value: 'register.success'}, 
    { key: 'REGISTER_ERROR', value: 'register.error'}, 
    { key: 'REGISTER_ACCEPT_TERMS', value: 'register.accept_terms'}
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
