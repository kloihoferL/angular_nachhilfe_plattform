import {Slot} from './slot';
import {User} from './user';
import {Course, Offer} from './offer';


export class Booking {

  constructor(
    public id: string,
    public created_at: Date,
    public updated_at: Date,
    public giver: User,
    public course:Course,
    public receiver: User,
    public offer: Offer,
    public slot: Slot,

  ) {}





}

