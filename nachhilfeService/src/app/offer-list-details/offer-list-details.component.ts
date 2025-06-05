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
import {AppointmentStoreService} from '../shared/appointment-store.service';

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
  selectedAppointment = signal<Date | null>(null);
  messageText = signal<string>('');

  constructor(private os:OfferStoreService, private route:ActivatedRoute,
              private toastr:ToastrService, private router:Router,
              public authService: AuthentificationService, private bs:BookingStoreService,
              private as:AppointmentStoreService) {

  }

  ngOnInit() {
    const params = this.route.snapshot.params;
    this.os.getSingle(params['id']).subscribe(
      (o:Offer) => this.offer.set(o));

  }

  openModal(){
    if (!this.authService.isLoggedIn()) {
      this.toastr.warning('Du musst eingeloggt sein, um eine Buchung vorzunehmen.');
      this.router.navigate(['/login']);
      return;
    }

      this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.selectedSlot.set(null);
  }

  onAppointmentChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.selectedAppointment.set(value ? new Date(value) : null);
  }

  onMessageChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.messageText.set(value);
  }


  getbookingData() {
    const offer = this.offer();
    if (!offer || !this.selectedSlot()) {
      this.toastr.warning('Bitte wählen Sie einen Termin.');
      return;
    }

    const payload:any = {
      giver_id: offer.giver.id,
      receiver_id: this.authService.getCurrentUserId(),
      //receiver_id: offer.giver.id,
      offer_id: offer.id,
      slot_id: this.selectedSlot()?.id,
      course_id: offer.course.id,
    };

    console.log('Buchungspayload:', payload);


    this.bs.create(payload).subscribe({
      next: () => {
        this.toastr.success('Buchung erfolgreich!');
        this.closeModal();
        this.router.navigate(['/mein-account']);
      },
      error: (err) => {
        this.toastr.error('Fehler beim Buchen');
        console.error(err);
      }
    });
  }

  getAppointmentData(){
    const offer = this.offer();
    if(!this.selectedAppointment()){
      this.toastr.warning("Bitte wählen sie eine Wunsch-Termin aus.")
    }

    if (!offer){
      this.toastr.error('Angebot nicht gefunden.');
      return;
    }

    const AppointmentPayload: any = {
      offer_id: offer.id,
      sender_id: this.authService.getCurrentUserId(),
      receiver_id: offer.giver.id,
      requested_time: this.selectedAppointment(),
      message: this.messageText()
  }
    console.log('Termin-Payload:', AppointmentPayload);

    this.as.create(AppointmentPayload).subscribe({
      next: () => {
        this.toastr.success('Terminvorschlag wurde an Geber geschickt! Dieser wird sich zeitnah melden.');
        this.closeModal();
      },
      error: (err) => {
        this.toastr.error('Terminvorschlag konnte nicht gesendet werden.');
        console.error(err);
      }
    });



  }






}
