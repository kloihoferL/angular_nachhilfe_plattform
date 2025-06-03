import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, Observable, retry, throwError} from 'rxjs';
import {Slot} from './slot';

@Injectable({
  providedIn: 'root'
})
export class SlotStoreService {
  private api = "http://nachhilfeservice.s2210456016.student.kwmhgb.at/api"

  constructor(private http: HttpClient) { } //httpClient wird injected

  create(slot: any): Observable<Slot> {
    return this.http.post<Slot>(`${this.api}/createSlot`, slot)
      .pipe(retry(3), catchError(this.errorHandler)
    );
  }


  private errorHandler(error: Error | any): Observable<any> {
    return throwError(error);
  }



}
