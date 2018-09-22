import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent }   from './home/home.component';
import { PersonNoticeboardComponent }      from './person-noticeboard/person-noticeboard.component';
import { PersonGraveyardComponent }    from './person-graveyard/person-graveyard.component';
import { AnimalNoticeboardComponent }    from './animal-noticeboard/animal-noticeboard.component';
import { AnimalGraveyardComponent } from './animal-graveyard/animal-graveyard.component';
import { ContactusComponent }      from './contactus/contactus.component';
import { StaticpageComponent }    from './staticpage/staticpage.component';
import { ForumComponent }    from './forum/forum.component';
import { PricingComponent }    from './pricing/pricing.component';
import { CatacombComponent }    from './catacomb/catacomb.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'home/:isReturned', component: HomeComponent },
  { path: 'noticeboard', component: PersonNoticeboardComponent },
  { path: 'graveyard/:position/:scene', component: PersonGraveyardComponent },
  { path: 'contactus', component: ContactusComponent },
  { path: 'forum', component: ForumComponent },
  { path: 'pricing', component: PricingComponent },
  { path: 'staticpage/:id', component: StaticpageComponent },
  { path: 'catacomb', component: CatacombComponent },
  { path: 'pet-noticeboard', component: AnimalNoticeboardComponent },
  { path: 'pet-graveyard/:position/:scene', component: AnimalGraveyardComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, {useHash: true}) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}