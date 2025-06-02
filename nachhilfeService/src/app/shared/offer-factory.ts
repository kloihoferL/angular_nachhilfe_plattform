import { Injectable } from '@angular/core';
import {Course, Offer, User} from './offer';
import {Slot} from './slot';

@Injectable({
  providedIn: 'root'
})
export class OfferFactory {

  static empty():Offer{
    return new Offer('', '', '', new Course('',''),new User('', '', '', '', ''),
      '', false, [], new Date(), new Date());
  }

  static fromObject(rawOffer: any): Offer {
    return new Offer(
      rawOffer.id,
      rawOffer.name,
      rawOffer.description,
      new Course(
        rawOffer.course?.id,
        rawOffer.course?.name
      ),
      rawOffer.giver,
      rawOffer.comment,
      rawOffer.booked,
      rawOffer.slots
        ? rawOffer.slots.map((s: any) =>
          new Slot(s.id, s.start_time, s.end_time, s.offer_id, s.is_booked)
        )
        : [],
      typeof rawOffer.created_at === 'string'
        ? new Date(rawOffer.created_at)
        : rawOffer.created_at,
      typeof rawOffer.updated_at === 'string'
        ? new Date(rawOffer.updated_at)
        : rawOffer.updated_at
    );
  }

}

