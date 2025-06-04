import {Component, computed, input, OnInit, signal} from '@angular/core';
import {OfferStoreService} from '../shared/offer-store.service';
import {BookingStoreService} from '../shared/booking-store.service';
import {Offer} from '../shared/offer';
import {OfferListItemComponent} from '../offer-list-item/offer-list-item.component';
import {DatePipe, NgClass} from '@angular/common';
import {OfferListComponent} from '../offer-list/offer-list.component';
import {AuthentificationService} from '../shared/authentification.service';
import {ToastrService} from 'ngx-toastr';
import {Router, RouterLink} from '@angular/router';
import {Booking} from '../shared/booking';


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
  activeTab: 'bookings' | 'offers' = 'bookings'; // default auf booking setzen

  constructor(private bs:BookingStoreService, private os:OfferStoreService, public auth:AuthentificationService,
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
          this.toastr.error('Das Angebot konnte nicht gelöscht werden da es schonmal gebucht wurde');
        }
      );
    }
  }

  filteredBookings = computed(() => {
    const allBookings = this.bookings();
    const currentUserId = this.auth.getCurrentUserId();
    const role = this.auth.getCurrentUserRole();

    console.log('Aktueller User:', currentUserId);
    console.log('Rolle:', role);

    allBookings.forEach(b => {
      console.log('Booking ID:', b.id, 'Giver ID:', b.giver?.id, 'Receiver ID:', b.receiver?.id);
    });

    if (role === 'geber') {
      return allBookings.filter(b => b.giver?.id == currentUserId);
    } else if (role === 'nehmer') {
      return allBookings.filter(b => b.receiver?.id == currentUserId);
    } else {
      return [];
    }
  });

  filteredOffers = computed(() => {
    const allOffers = this.offers();
    const currentUserId = this.auth.getCurrentUserId();
    const role = this.auth.getCurrentUserRole();

    console.log('Alle Offers:', allOffers);
    console.log('Aktueller User:', currentUserId);
    console.log('Rolle:', role);

    allOffers.forEach(o => {
      console.log('Offer ID:', o.id, 'Giver ID:', o.giver?.id);
    });

    if (role === 'geber') {
      return allOffers.filter(o => o.giver?.id == currentUserId);
    } else {
      return [];
    }
  });








}
