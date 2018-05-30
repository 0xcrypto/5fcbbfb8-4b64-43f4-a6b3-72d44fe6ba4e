import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient }    from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';


import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';
import { HomeComponent } from './home/home.component';
import { NoticeboardComponent } from './noticeboard/noticeboard.component';


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NoticeboardComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
	  HttpClientModule,
	  TranslateModule.forRoot({
		  loader: {
		    provide: TranslateLoader,
		    useFactory: (HttpLoaderFactory),
		    deps: [HttpClient]
		  }
  	})
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
