import { Component, OnInit } from '@angular/core';
import { Advertisement } from '../classes/advertisement';
import { AdvertisementService } from '../services/advertisement.service';

@Component({
  selector: 'app-noticeboard',
  templateUrl: './noticeboard.component.html',
  styleUrls: ['./noticeboard.component.css']
})
export class NoticeboardComponent implements OnInit {
  isHiddenTab:boolean = true;
  activeTab:string = null;
  
  advertisements: Advertisement[] = [];
  
  constructor(private advertisementService: AdvertisementService) { }

  ngOnInit() {
    this.activeTab = 'graveyard-noticeboard';
	  this.getAdvertisements();
  }

  openTab(name:string) {
    this.activeTab = name;
  }
  
  getAdvertisements(): void {
    this.advertisementService.getAll()
      .subscribe(advertisements => this.advertisements = advertisements);
	  
	  //.slice(1, 5)
  }
}
