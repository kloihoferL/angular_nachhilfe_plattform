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
import {MessageStoreService} from '../shared/message-store.service';
import {Message} from '../shared/message';

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
  messageNotifications = signal<Message[]>([]);

  constructor(public as:AppointmentStoreService, private toastr:ToastrService,
              public auth:AuthentificationService,
              private bs:BookingStoreService,
              private ss:SlotStoreService,
              private ms:MessageStoreService) {
  }

  ngOnInit() {
   //this.as.getallAppointments().subscribe(res => this.notifications.set(res));
    this.as.getallAppointments().subscribe((appointments: Appointment[]) => {
      const pending = appointments.filter(app => app.status === 'pending');
      this.notifications.set(pending);
    });

    this.getAllMessages();
  }

  loadPendingNotifications() {
    this.as.getallAppointments().subscribe((appointments: Appointment[]) => {
      const pending = appointments.filter(app => app.status === 'pending');
      this.notifications.set(pending);
    });
  }

  getAllMessages() {
    const currentUserId = this.auth.getCurrentUserId();

    this.ms.getallMessages().subscribe((messages: Message[]) => {
      const receivedMessages = messages.filter(msg => msg.receiver_id == currentUserId);
      this.messageNotifications.set(receivedMessages);
    });
  }


  rejectAppointment(id: string) {
    if (confirm('Soll der Termin wirklich abgelehnt werden?')) {
      this.as.rejectAppointment(id).subscribe({
        next: () => {
          this.toastr.success('Der Termin wurde abgelehnt');
          this.loadPendingNotifications(); // Liste neu laden
        },
        error: err => {
          console.error(err);
          this.toastr.error('Es gab ein Problem beim Ablehnen des Termins');
        }
      });
    } else {
      this.toastr.info('Ablehnen abgebrochen.');
    }
  }



  acceptAppointment(id: string) {
    const appointment = this.notifications().find(n => String(n.id) == id);

    if (!appointment) {
      console.log('Termin nicht gefunden.');
      return;
    }

    if (!confirm('Soll der Termin wirklich akzeptiert werden?')) {
      console.log('Akzeptieren abgebrochen.');
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
        if (!createdSlot?.id) {
         console.log('Slot wurde erstellt, aber ID fehlt.');
          return;
        }

       console.log('Slot erfolgreich erstellt!');

        const bookingPayload: BookingPayload = {
          offer_id: appointment.offer.id,
          receiver_id: appointment.sender.id,
          giver_id: appointment.receiver.id,
          slot_id: createdSlot.id,
        };

        this.bs.create(bookingPayload).subscribe({
          next: () => {
            this.as.acceptAppointment(id).subscribe({
              next: () => {
                this.toastr.success('Der Termin wurde erfolgreich akzeptiert und eine Buchung erstellt');
                this.loadPendingNotifications(); // Aktualisiere Liste Notifications
              },
              error: err => {
                console.error('Fehler beim Akzeptieren des Termins:', err);
                this.toastr.error('Fehler beim Speichern des akzeptierten Termins.');
              }
            });
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

  onDeleteMessage(id: string) {
    if (!confirm('Willst du diese Nachricht wirklich löschen?')) {
      return;
    }

    this.ms.deleteMessage(id).subscribe({
      next: () => {
        this.toastr.success('Nachricht gelöscht');
        this.getAllMessages(); // Nach dem Löschen aktualisieren
      },
      error: err => {
        console.error('Fehler beim Löschen:', err);
        this.toastr.error('Nachricht konnte nicht gelöscht werden');
      }
    });
  }






}
