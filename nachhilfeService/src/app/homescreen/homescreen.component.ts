import { Component } from '@angular/core';
import {OfferListComponent} from '../offer-list/offer-list.component';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-homescreen',
  imports: [
    OfferListComponent,
    RouterLink
  ],
  templateUrl: './homescreen.component.html',
  styles: ``
})
export class HomescreenComponent {

}
