import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { OfferStoreService } from '../shared/offer-store.service';
import { OfferFactory } from '../shared/offer-factory';
import { Offer } from '../shared/offer';
import { Course } from '../shared/course';

@Component({
  selector: 'bs-offer-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './offer-form.component.html',
  styles: ``
})
export class OfferFormComponent implements OnInit {
  offerForm!: FormGroup;
  offer = OfferFactory.empty();
  isUpdatingOffer = false;

  constructor(
    private fb: FormBuilder,
    private os: OfferStoreService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isUpdatingOffer = true;
      this.os.getSingle(id).subscribe(offer => {
        this.offer = offer;
        this.initOffer();
      });
    } else {
      this.initOffer();
    }
  }

  initOffer() {
    this.offerForm = this.fb.group({
      name: [this.offer.name, Validators.required],
      description: [this.offer.description],
      comment: [this.offer.comment],
      course: this.fb.group({
        name: [this.offer.course?.name || '', Validators.required],
        subcourses: this.fb.array([])
      }),
      slots: this.fb.array([])
    });

    if (this.offer.slots?.length) {
      for (const slot of this.offer.slots) {
        this.addSlot(slot);
      }
    } else {
      this.addSlot(); // mindestens ein Slot
    }

    if (this.offer.course?.subcourses?.length) {
      for (const sub of this.offer.course.subcourses) {
        this.addSubcourse(sub);
      }
    } else {
      this.addSubcourse(); // mindestens ein Subkurs
    }
  }

  get slots(): FormArray {
    return this.offerForm.get('slots') as FormArray;
  }

  get subcourses(): FormArray {
    return this.offerForm.get(['course', 'subcourses']) as FormArray;
  }

  addSlot(slot?: any) {
    this.slots.push(
      this.fb.group({
        start_time: [slot?.start_time || '', Validators.required],
        end_time: [slot?.end_time || '', Validators.required]
      })
    );
  }

  removeSlot(index: number) {
    this.slots.removeAt(index);
  }

  addSubcourse(sub?: any) {
    this.subcourses.push(
      this.fb.group({
        name: [sub?.name || '', Validators.required]
      })
    );
  }

  removeSubcourse(index: number) {
    this.subcourses.removeAt(index);
  }

  submitForm() {
    const raw = this.offerForm.value;

    const offerPayload = {
      name: raw.name,
      description: raw.description,
      comment: raw.comment,
      user_id: 1, // Sicherstellen, dass User mit ID 1 existiert!
      course: {
        name: raw.course.name,
        subcourses: raw.course.subcourses
      },
      slots: raw.slots.filter((s: any) => s.start_time && s.end_time)
    };

    this.os.create(offerPayload).subscribe({
      next: () => {
        this.offerForm.reset(OfferFactory.empty());
        this.offer = OfferFactory.empty();
        this.router.navigate(['/offers']);
      },
      error: (err) => {
        console.error('Fehler beim Speichern:', err);
      }
    });
  }

}
