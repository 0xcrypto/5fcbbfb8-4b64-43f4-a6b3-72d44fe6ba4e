import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent }   from './home/home.component';
import { NoticeboardComponent }      from './noticeboard/noticeboard.component';
import { FooterComponent }      from './footer/footer.component';
import { ContactusComponent }      from './contactus/contactus.component';
import { StaticpageComponent }    from './staticpage/staticpage.component';
import { ForumComponent }    from './forum/forum.component';
import { PricingComponent }    from './pricing/pricing.component';
import { GraveyardComponent }    from './graveyard/graveyard.component';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'home/:isReturned', component: HomeComponent },
  { path: 'noticeboard', component: NoticeboardComponent },
  { path: 'contactus', component: ContactusComponent },
  { path: 'forum', component: ForumComponent },
  { path: 'pricing', component: PricingComponent },
  { path: 'staticpage/:id', component: StaticpageComponent },
  { path: 'graveyard/:position/:scene', component: GraveyardComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, {useHash: true}) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}