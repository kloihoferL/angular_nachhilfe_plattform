import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Booking} from './bookingpayload';
import {catchError, Observable, retry, throwError} from 'rxjs';
import {Appointment} from './appointment';

@Injectable({
  providedIn: 'root'
})
export class AppointmentStoreService {
  private api = "http://nachhilfeservice.s2210456016.student.kwmhgb.at/api"


  constructor(private http: HttpClient) { }

  getallAppointments(){
    return this.http.get<Array<Appointment>>(`${this.api}/appointmentRequests`).
    pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  //TODO: IM BE implementieren
  getAppointmentByUserId(userId: string): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.api}/appointmentRequestsByUser/${userId}`).
      pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  private errorHandler(error: Error | any): Observable<any> {
    return throwError(error);
  }


}
