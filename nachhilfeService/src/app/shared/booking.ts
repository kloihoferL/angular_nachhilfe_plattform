import { Slot } from './slot';
import { Offer } from './offer';
import { Course } from './course';
import { Subcourse } from './subcourse';
import { User } from './user';

export interface Booking {
    id: number;
    created_at: string;
    updated_at: string;
    giver_id: string;
    receiver_id: string;
    offer_id: string;
    slot_id: string;

    slot: Slot;
    offer: OfferWithCourse;
    giver: User;
    receiver: User;
}

export interface OfferWithCourse extends Offer {
    course: CourseWithSubcourses;
}

export interface CourseWithSubcourses extends Course {
    subcourses: Subcourse[];
}
