import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Offer} from './offer';
import {catchError, Observable, retry, throwError} from 'rxjs';
import {Message} from './message';

@Injectable({
  providedIn: 'root'
})
export class MessageStoreService {

  private api = "http://nachhilfeservice.s2210456016.student.kwmhgb.at/api"

  constructor(private http: HttpClient) { }

  getallMessages(){
    return this.http.get<Array<Message>>(`${this.api}/getMessages`).
    pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  deleteMessage(id: string): Observable<any> {
    return this.http.delete(`${this.api}/deleteMessage/${id}`).
    pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  private errorHandler(error: Error | any): Observable<any> {
    return throwError(error);
  }


}
