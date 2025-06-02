import {Component, input, OnInit, signal} from '@angular/core';
import {OfferStoreService} from '../shared/offer-store.service';
import {BookingStoreService} from '../shared/booking-store.service';
import {Offer} from '../shared/offer';
import {Booking} from '../shared/booking';
import {OfferListItemComponent} from '../offer-list-item/offer-list-item.component';
import {DatePipe, NgClass} from '@angular/common';
import {OfferListComponent} from '../offer-list/offer-list.component';
import {AuthentificationService} from '../shared/authentification.service';
import {ToastrService} from 'ngx-toastr';
import {Router, RouterLink} from '@angular/router';


@Component({
  selector: 'bs-my-profile',
  imports: [
    OfferListItemComponent,
    DatePipe,
    OfferListComponent,
    RouterLink,
    NgClass
  ],
  templateUrl: './my-profile.component.html',
  styles: ``
})
export class MyProfileComponent implements OnInit{

  bookings = signal<Booking[]>([]);
  offers = signal<Offer[]>([]);
  //offer = signal<Offer|undefined>(undefined);
  activeTab: 'bookings' | 'offers' = 'offers'; // default tab


  constructor(private bs:BookingStoreService, private os:OfferStoreService, private auth:AuthentificationService,
              private toastr:ToastrService, private router: Router) {

  }

ngOnInit() {
    this.bs.getallBookings().subscribe(res => this.bookings.set(res));
    this.os.getOffersByGiverId(this.auth.getCurrentUserId()).subscribe(res => this.offers.set(res));
  }

  removeOffer(id: string) {
    if (confirm('Soll das Angebot wirklich gelöscht werden?')) {
      this.os.deleteSingleOffer(id).subscribe(
        () => {
          this.toastr.success('Das Angebot wurde gelöscht');
          // Entferne es aus der Liste:
          this.offers.update(current => current.filter(o => o.id !== id));
        },
        () => {
          this.toastr.error('Das Angebot konnte nicht gelöscht werden');
        }
      );
    }
  }

}
