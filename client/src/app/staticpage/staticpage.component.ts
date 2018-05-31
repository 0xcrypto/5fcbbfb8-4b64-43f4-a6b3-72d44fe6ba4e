import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { AppGlobals } from '../app.globals';
import { StaticPage } from '../classes/staticpage';
import { StaticPageService } from '../services/staticpage.service';

@Component({
  selector: 'app-staticpage',
  templateUrl: './staticpage.component.html',
  styleUrls: ['./staticpage.component.css'],
  providers: [AppGlobals]
})
export class StaticpageComponent implements OnInit {
  page: StaticPage = null;
  language: string = null;

  constructor(private route: ActivatedRoute, private staticpageService: StaticPageService,
    private location: Location, private _global: AppGlobals) { }

  ngOnInit() {
    this.getStaticPage();
    this.language = this._global.getLanguage();
  }


  getStaticPage(): void {
    this.page = null;
    const id = +this.route.snapshot.paramMap.get('id');
    this.staticpageService.get(id)
      .subscribe(staticpage => this.page = staticpage);
  }
}
