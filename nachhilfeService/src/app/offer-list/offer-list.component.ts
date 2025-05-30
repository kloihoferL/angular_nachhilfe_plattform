import {Component, OnInit, signal} from '@angular/core';
import {OfferStoreService} from '../shared/offer-store.service';
import {Offer} from '../shared/offer';
import {OfferListItemComponent} from '../offer-list-item/offer-list-item.component';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-offer-list',
  standalone: true,
  imports: [
    OfferListItemComponent,
    RouterLink
  ],
  templateUrl: './offer-list.component.html',
})

export class OfferListComponent implements OnInit {

  offers = signal<Offer[]>([]);

  constructor(private os:OfferStoreService) {
  }

  ngOnInit() {
    this.os.getallOffers().subscribe(res => this.offers.set(res));
  }

}
