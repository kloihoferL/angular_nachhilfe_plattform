
import {User} from './user';
import {Offer} from './offer';
export {Offer} from './offer';
export {User} from './user';


export class Appointment {

  constructor(
    public id: string,
    public created_at: Date,
    public updated_at: Date,
    public offer:Offer,
    public sender:User,
    public receiver:User,
    public requested_time: Date,
    public message :string,
    public status: string,


  ) {}



}

