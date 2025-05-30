import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {NavbarComponent} from './navbar/navbar.component';
import {HomescreenComponent} from './homescreen/homescreen.component';
import {OfferListComponent} from './offer-list/offer-list.component';
import {OfferFormComponent} from './offer-form/offer-form.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, HomescreenComponent, OfferListComponent, OfferFormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'nachhilfeService';
}
