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

@Component({
  selector: 'app-offer-list-details',
  imports: [
    RouterLink,
    DatePipe
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
  selectedSubCourses = signal<Subcourse[]>([]);

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
    this.selectedSubCourses.set([]);
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

  toggleSubcourse(sub: Subcourse, event: Event) {
    const input = event.target as HTMLInputElement;
    const checked = input?.checked ?? false;

    const current = this.selectedSubCourses();
    if (checked) {
      if (!current.some(s => s.id === sub.id)) {
        this.selectedSubCourses.set([...current, sub]);
      }
    } else {
      this.selectedSubCourses.set(current.filter(s => s.id !== sub.id));
    }
  }


  isSubcourseSelected(id: string): boolean {
    return this.selectedSubCourses().some(s => s.id === id);
  }



  /*getbookingData() {
    const offer = this.offer();
    if (!offer || !this.selectedSlot()) {
      this.toastr.warning('Bitte wählen Sie einen Termin.');
      return;
    }

    const payload = {
      id: offer.id,
      created_at: new Date(),
      updated_at: new Date(),
      giver: offer.giver.id,
      course: offer.course,
      receiver: this.authService.getCurrentUserId(),
      offer: offer,
      slot: this.selectedSlot(),
      subcourses: this.selectedSubCourses(),
    };

    console.log('Buchungspayload:', payload);

    // Jetzt an dein Backend senden

    this.bs.create(payload);

  }*/





}
