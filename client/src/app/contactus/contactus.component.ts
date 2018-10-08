import { Component, OnInit } from '@angular/core';
import { ImageService } from '../services/image.service';

@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html'
})
export class ContactusComponent implements OnInit {

  constructor(private imageService:ImageService) { }

  ngOnInit() {
  }

}
