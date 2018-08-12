import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { AppGlobals } from '../app.globals';
import { StaticPage } from '../classes/staticpage';
import { DataService } from '../services/data.service';

export interface Options {
};

@Component({
  selector: 'app-staticpage',
  templateUrl: './staticpage.component.html',
  providers: [AppGlobals]
})
export class StaticpageComponent implements OnInit {
  page: StaticPage = null;
  language: string = null;
  options: Options = null;

  constructor(private route: ActivatedRoute, private dataService: DataService,
    private location: Location, private _global: AppGlobals) { }

  ngOnInit() {
    this.getStaticPage();
    this.language = this._global.getLanguage();
  }


  getStaticPage(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.options = this._global.refreshObject(this.options, ['id='+id]);
    this.dataService.getWithMethodAndOptions('STATIC_PAGE_DETAILS', this._global.serializeAndURIEncode(this.options))
      .subscribe(staticpage => {
        this.page = staticpage;
    });
  }
}
