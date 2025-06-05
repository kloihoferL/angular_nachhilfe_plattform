import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
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

  create(appointment: Appointment): Observable<any> {
    return this.http.post(`${this.api}/newAppointment`, appointment).
      pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  acceptAppointment(id: string): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.api}/acceptAppointment/${id}`, {}).
      pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  rejectAppointment(id: string): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.api}/rejectAppointment/${id}`, {}).
      pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  private errorHandler(error: Error | any): Observable<any> {
    return throwError(error);
  }


}
