import { Routes } from '@angular/router';
import {AppComponent} from './app.component';
import {OfferListItemComponent} from './offer-list-item/offer-list-item.component';
import {OfferListComponent} from './offer-list/offer-list.component';
import {HomescreenComponent} from './homescreen/homescreen.component';
import {OfferListDetailsComponent} from './offer-list-details/offer-list-details.component';
import {OfferFormComponent} from './offer-form/offer-form.component';
import {LoginComponent} from './login/login.component';
import {canNavigateToAdminGuard, canNavigateToLoginGuard} from '../../navigate-guard';
import {MyProfileComponent} from './my-profile/my-profile.component';
import {NotificationsComponent} from './notifications/notifications.component';

export const routes: Routes = [
  {path:'', redirectTo:'home', pathMatch:'full'},
  {path:'angebote', component: OfferListComponent},
  {path:'', component: HomescreenComponent},
  {path:'angebote/:id', component: OfferListDetailsComponent},
  {path:'angebot-erstellen', component: OfferFormComponent, canActivate:[canNavigateToAdminGuard]},
  {path:'login', component: LoginComponent},
  {path:'mein-account', component: MyProfileComponent, canActivate:[canNavigateToLoginGuard]},
  {
    path: 'angebote/:id/edit',
    component: OfferFormComponent,  canActivate:[canNavigateToAdminGuard]
  },
  {path:'benachrichtigungen', component:NotificationsComponent, canActivate:[canNavigateToLoginGuard]}
];
