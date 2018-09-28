import { NgModule } from '@angular/core';
import { WebStorageModule } from 'ngx-store';
import { NgxPayPalModule } from 'ngx-paypal';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient }    from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';
import { HomeComponent } from './home/home.component';
import { PersonNoticeboardComponent } from './person-noticeboard/person-noticeboard.component';
import { PersonGraveyardComponent } from './person-graveyard/person-graveyard.component';
import { FooterComponent } from './footer/footer.component';
import { ContactusComponent } from './contactus/contactus.component';
import { StaticpageComponent } from './staticpage/staticpage.component';
import { ForumComponent } from './forum/forum.component';
import { HeaderComponent } from './header/header.component';
import { PricingComponent } from './pricing/pricing.component';
import { LogoComponent } from './logo/logo.component';
import { SoundComponent } from './sound/sound.component';
import { ShopComponent } from './shop/shop.component';
import { CatacombComponent } from './catacomb/catacomb.component';
import { NgSlimScrollModule, SLIMSCROLL_DEFAULTS } from 'ngx-slimscroll';
import { AnimalNoticeboardComponent } from './animal-noticeboard/animal-noticeboard.component';
import { AnimalGraveyardComponent } from './animal-graveyard/animal-graveyard.component';
import { UserMgtComponent } from './user-mgt/user-mgt.component';

import { UserService } from './services/user.service';
import { MessageService } from './services/message.service';
import { AppGlobals } from './app.globals';
import { AccountComponent } from './account/account.component';
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}


@NgModule({
  declarations: [
    AppComponent,
    PersonNoticeboardComponent,
    PersonGraveyardComponent,
    AnimalNoticeboardComponent,
    AnimalGraveyardComponent,
    HomeComponent,
    FooterComponent,
    ContactusComponent,
    StaticpageComponent,
    ForumComponent,
    HeaderComponent,
    PricingComponent,
    LogoComponent,
    SoundComponent,
    ShopComponent,
    CatacombComponent,
    UserMgtComponent,
    AccountComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    WebStorageModule,
    NgxPayPalModule,
	  TranslateModule.forRoot({
		  loader: {
		    provide: TranslateLoader,
		    useFactory: (HttpLoaderFactory),
		    deps: [HttpClient]
		  }
  	})
  ],
  providers: [ {
    provide: SLIMSCROLL_DEFAULTS,
    useValue: {
      barBackground: "#FFF",
      barOpacity: "1",
      barBorderRadius: "3px",
      alwaysVisible: true
    }
  }, UserService, AppGlobals, MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
