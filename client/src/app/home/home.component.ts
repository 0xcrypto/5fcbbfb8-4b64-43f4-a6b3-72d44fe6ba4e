import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  isGateOpen:boolean=false;
  isReturnedToMainGate:boolean = false;
  router:Router = null;

  constructor(private _router: Router, private route: ActivatedRoute) {
    this.router = _router;
  }

  ngOnInit() {}
  
  ngAfterViewInit(){
    this.backToMainGate();
  }

  backToMainGate(): void {
    const isReturned = +this.route.snapshot.paramMap.get('isReturned');
    if(isReturned){
      this.isReturnedToMainGate = true;
    }
  }

  openGate() {
    this.isGateOpen = true;
    setTimeout(()=>{  
      this.router.navigateByUrl('/noticeboard');
    }, 1000);
  }

}


