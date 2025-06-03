import {Component, OnInit, signal} from '@angular/core';
import {OfferStoreService} from '../shared/offer-store.service';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {Course, Offer, User} from '../shared/offer';
import {DatePipe} from '@angular/common';
import {ToastrService} from 'ngx-toastr';
import {Slot} from '../shared/slot';
import {AuthentificationService} from '../shared/authentification.service';
import {Subcourse} from '../shared/subcourse';
import {HttpClient} from '@angular/common/http';
import {BookingStoreService} from '../shared/booking-store.service';
import {BookingPayload} from '../shared/booking-payload';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-offer-list-details',
  imports: [
    RouterLink,
    DatePipe,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './offer-list-details.component.html',
  styles: ``
})
export class OfferListDetailsComponent implements OnInit {

  offer = signal<Offer|undefined>(undefined);
  //showModal:boolean = false;
  //selectedSlot: number | null = null;
 // selectedSubCourses: number[] = [];


  showModal = signal<boolean>(false);
  selectedSlot = signal<Slot | null>(null);

  constructor(private os:OfferStoreService, private route:ActivatedRoute,
              private toastr:ToastrService, private router:Router,
              private authService: AuthentificationService, private bs:BookingStoreService) {

  }

  ngOnInit() {
    const params = this.route.snapshot.params;
    this.os.getSingle(params['id']).subscribe(
      (o:Offer) => this.offer.set(o));

  }

  openModal(){
      this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.selectedSlot.set(null);
  }

  /*toggleSubcourse(id: string, checked: boolean) {
    const current = this.selectedSubCourses();
    if (checked) {
      if (!current.includes(id)) {
        this.selectedSubCourses.set([...current, id]);
      }
    } else {
      this.selectedSubCourses.set(current.filter(subId => subId !== id));
    }
  }*/



  /*getbookingData() {
    const offer = this.offer();
    if (!offer || !this.selectedSlot()) {
      this.toastr.warning('Bitte wählen Sie einen Termin.');
      return;
    }

    const payload = [{
      giver_id: offer.giver.id,
      receiver_id: this.authService.getCurrentUserId(),
      offer_id: offer.id,
      slot_id: this.selectedSlot()!.id,
      course_id: offer.course.id
    }];

    console.log('Buchungspayload:', payload);
    this.bs.create(payload);

  }*/


  getbookingData() {
    const offer = this.offer();
    if (!offer || !this.selectedSlot()) {
      this.toastr.warning('Bitte wählen Sie einen Termin.');
      return;
    }

    const payload:any = [{
      giver_id: offer.giver.id,
      receiver_id: this.authService.getCurrentUserId(),
      offer_id: offer.id,
      slot_id: this.selectedSlot()!.id,
      course_id: offer.course.id,
    }];

    console.log('Buchungspayload:', payload);


    this.bs.create(payload).subscribe({
      next: () => {
        this.toastr.success('Buchung erfolgreich!');
        //hier ist booked dann auf true setzen
        this.closeModal();
      },
      error: (err) => {
        this.toastr.error('Fehler beim Buchen');
        console.error(err);
      }
    });
  }






}
