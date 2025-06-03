import {Component, OnInit, signal} from '@angular/core';
import {Booking} from '../shared/booking';
import {Appointment} from '../shared/appointment';
import {AppointmentStoreService} from '../shared/appointment-store.service';
import {ToastrService} from 'ngx-toastr';
import {DatePipe} from '@angular/common';
import {AuthentificationService} from '../shared/authentification.service';
import {OfferFactory} from '../shared/offer-factory';
import {BookingStoreService} from '../shared/booking-store.service';
import {Slot} from '../shared/slot';
import {SlotStoreService} from '../shared/slot-store.service';
import {BookingPayload} from '../shared/booking-payload';

@Component({
  selector: 'bs-notifications',
  imports: [
    DatePipe
  ],
  templateUrl: './notifications.component.html',
  styles: ``
})
export class NotificationsComponent implements OnInit {
  notifications = signal(<Appointment[]>([]));

  constructor(public as:AppointmentStoreService, private toastr:ToastrService,
              public auth:AuthentificationService,
              private bs:BookingStoreService,
              private ss:SlotStoreService) {
  }

  ngOnInit() {
    this.as.getallAppointments().subscribe(res => this.notifications.set(res));

  }


  rejectAppointment(id:string) {
    console.log(id);
    if (confirm('Soll der Termin wirklich abgelehnt werden?')) {
      this.as.rejectAppointment(id);
      this.toastr.success('Der Termin wurde abgelehnt');
    }else{
      this.toastr.error('Es gab ein Problem beim Ablehnen des Termins');
    }

  }

  /*acceptAppointment(id:string){
    console.log(id);
    const stringId = String(id);
    const appointment = this.notifications().find(n => n.id == stringId);
    if (confirm('Soll der Termin wirklich akzeptiert werden?')) {
      this.as.acceptAppointment(id);
      this.toastr.success('Der Termin wurde akzeptiert');
      console.log("Appointment gefunden:", appointment);

      if(appointment){
        const startTime = new Date(appointment.requested_time);
        const endTime = new Date(startTime);
        endTime.setHours(endTime.getHours() + 2);

        const slotPayload = {
          start_time: new Date(appointment.requested_time),
          end_time: new Date(new Date(appointment.requested_time).setHours(new Date(appointment.requested_time).getHours() + 2)),
          offer_id: appointment.offer.id,
          is_booked: true
        }

        console.log(slotPayload);

        this.ss.create(slotPayload).subscribe({
          next: () => {
            this.toastr.success('Slot wurde erstellt!');
          },
          error: err => {
            console.error(err);
            this.toastr.error('Fehler beim Erstellen des Slots.');
          }
        })

        const bookingPayload = {
          offer_id: appointment.offer.id,
          receiver_id: appointment.sender.id,
          giver_id: appointment.receiver.id,
          slot_id:


        };
        console.log(bookingPayload);


      this.bs.create(bookingPayload).subscribe({
        next: () => {
          this.toastr.success('Buchung wurde aus Termin erstellt!');
        },
        error: err => {
          console.error(err);
          this.toastr.error('Fehler beim Erstellen der Buchung.');
        }
      });
      }

    }else{
      this.toastr.error('Es gab ein Problem beim Akzeptieren des Termins');
    }
  }*/

  acceptAppointment(id: string) {
    const appointment = this.notifications().find(n => String(n.id) == id);

    if (!appointment) {
      this.toastr.error('Termin nicht gefunden.');
      return;
    }

    if (!confirm('Soll der Termin wirklich akzeptiert werden?')) {
      this.toastr.info('Akzeptieren abgebrochen.');
      return;
    }

    const startTime = new Date(appointment.requested_time);
    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + 2);

    const toBackendDate = (date: Date): string =>
      date.toISOString().slice(0, 19).replace('T', ' ');

    const slotPayload = {
      start_time: toBackendDate(startTime),
      end_time: toBackendDate(endTime),
      offer_id: appointment.offer.id,
      is_booked: true
    };

    this.ss.create(slotPayload).subscribe({
      next: (createdSlot) => {
        console.log("neuer Slot id" + createdSlot.id);
        if (!createdSlot?.id) {
          this.toastr.error('Slot wurde erstellt, aber ID fehlt.');
          return;
        }

        this.toastr.success('Slot erfolgreich erstellt!');

        const bookingPayload:BookingPayload = {
          offer_id: appointment.offer.id,
          receiver_id: appointment.sender.id,
          giver_id: appointment.receiver.id,
          slot_id: createdSlot.id,
        };

        console.log("Booking Payload:", bookingPayload);

        this.bs.create(bookingPayload).subscribe({
          next: () => {
            this.toastr.success('Buchung erfolgreich erstellt!');
            this.as.acceptAppointment(id);
            this.removeNotificationById(id); // Frontend-Notification entfernen
// Nur bei erfolgreicher Buchung als akzeptiert markieren
          },
          error: err => {
            console.error('Fehler bei Buchung:', err);
            this.toastr.error('Fehler beim Erstellen der Buchung.');
          }
        });
      },
      error: err => {
        console.error('Fehler beim Erstellen des Slots:', err);
        this.toastr.error('Slot-Erstellung fehlgeschlagen.');
      }
    });
  }

  removeNotificationById(id: string) {
    const updated = this.notifications().filter(n => String(n.id) !== id);
    this.notifications.set(updated);
  }






}
