import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Offer} from './offer';
import {catchError, Observable, retry, throwError} from 'rxjs';
import {Booking} from './booking';
import {BookingPayload} from './booking-payload';

@Injectable({
  providedIn: 'root'
})
export class BookingStoreService {
  private api = "http://nachhilfeservice.s2210456016.student.kwmhgb.at/api"

  constructor(private http: HttpClient) { }

  getallBookings(){
    return this.http.get<Array<any>>(`${this.api}/bookings`).
    pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  create(bookings: any): Observable<any> {
    return this.http.post(`${this.api}/booking`, bookings,).
      pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  private errorHandler(error: Error | any): Observable<any> {
    return throwError(error);
  }

}
