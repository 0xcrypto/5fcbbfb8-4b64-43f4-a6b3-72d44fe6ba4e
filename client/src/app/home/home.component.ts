import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isGateOpen:boolean=false;
  router:Router = null;

  constructor(private translate: TranslateService, private _router: Router) {
    this.router = _router;
    translate.addLangs(['en', 'pl']);
    translate.setDefaultLang('en');
    translate.use('en'); }

  ngOnInit() {
  }

  changeLang(lang: string) {
    this.translate.use(lang);
  }

  openGate() {
    this.isGateOpen = true;
    setTimeout(()=>{  
      this.router.navigateByUrl('/noticeboard');
    },2000);
  }

}


