import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Offer} from './offer';
import {catchError, Observable, retry, throwError} from 'rxjs';
import {Booking} from './booking';

@Injectable({
  providedIn: 'root'
})
export class BookingStoreService {
  private api = "http://nachhilfeservice.s2210456016.student.kwmhgb.at/api"

  constructor(private http: HttpClient) { }

  getallBookings(){
    return this.http.get<Array<Booking>>(`${this.api}/bookings`).
    pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  create(booking: Booking): Observable<Booking> {
    return this.http.post<Booking>(`${this.api}/booking`, booking).
      pipe(retry(3)).pipe(catchError(this.errorHandler));
  }


  private errorHandler(error: Error | any): Observable<any> {
    return throwError(error);
  }

}
