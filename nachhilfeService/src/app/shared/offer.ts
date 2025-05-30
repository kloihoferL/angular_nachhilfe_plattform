import {User} from './user';
import {Course} from './course';
import {Slot} from './slot';
export {Course} from './course';
export {User} from './user';


export class Offer {

  constructor(
    public id: string,
    public name: string,
    public description: string,
    public course: Course,
    public giver: User,
    public comment: string,
    public booked: boolean = false,
    public slots: Slot[],
    public created_at?: Date,
    public updated_at?: Date
  ) {}





}

