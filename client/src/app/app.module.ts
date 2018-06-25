import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient }    from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ScrollbarModule } from 'ngx-scrollbar';


import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';
import { HomeComponent } from './home/home.component';
import { NoticeboardComponent } from './noticeboard/noticeboard.component';
import { FooterComponent } from './footer/footer.component';
import { ContactusComponent } from './contactus/contactus.component';
import { StaticpageComponent } from './staticpage/staticpage.component';
import { ForumComponent } from './forum/forum.component';
import { HeaderComponent } from './header/header.component';
import { PricingComponent } from './pricing/pricing.component';
import { LogoComponent } from './logo/logo.component';
import { GraveLoadingComponent } from './grave-loading/grave-loading.component';


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NoticeboardComponent,
    FooterComponent,
    ContactusComponent,
    StaticpageComponent,
    ForumComponent,
    HeaderComponent,
    PricingComponent,
    LogoComponent,
    GraveLoadingComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    ScrollbarModule,
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
