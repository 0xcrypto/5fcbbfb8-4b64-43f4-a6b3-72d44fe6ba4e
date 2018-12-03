import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-authors',
  templateUrl: './authors.component.html'
})
export class AuthorsComponent implements OnInit {
  isOpen: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  closeButtonClick(){
    this.isOpen = false;
  }

  openAuthorsDialog(){
    this.isOpen = true;
  }
}
