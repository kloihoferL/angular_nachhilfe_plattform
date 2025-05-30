import { Component } from '@angular/core';
import {OfferListComponent} from '../offer-list/offer-list.component';
import {RouterLink} from '@angular/router';
import {LoginComponent} from '../login/login.component';

@Component({
  selector: 'app-homescreen',
  imports: [
    OfferListComponent,
    RouterLink,
    LoginComponent
  ],
  templateUrl: './homescreen.component.html',
  styles: ``
})
export class HomescreenComponent {

}
