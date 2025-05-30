import {Component, input} from '@angular/core';

import {Offer} from '../shared/offer';

@Component({
  selector: 'a.app-offer-list-item',
  standalone: true,
  imports: [],
  templateUrl: './offer-list-item.component.html',
  styles: ``
})
export class OfferListItemComponent {
  offer = input.required<Offer>();
  //offer = input<Offer>();


}
