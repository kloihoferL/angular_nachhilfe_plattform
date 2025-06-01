import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppComponent} from '../app.component';
import {catchError, Observable, retry, throwError} from 'rxjs';
import {Offer} from './offer';

@Injectable({
  providedIn: 'root'
})
export class OfferStoreService {
  private api = "http://nachhilfeservice.s2210456016.student.kwmhgb.at/api"

  constructor(private http: HttpClient) { } //httpClient wird injected

  getallOffers(){
    return this.http.get<Array<Offer>>(`${this.api}/offers`).
    pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  getSingle(id: string): Observable<Offer> {
    return this.http.get<Offer>(`${this.api}/offers/${id}`).
    pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  getOffersByGiverId(giverId: string): Observable<Offer[]> {
    return this.http.get<Offer[]>(`${this.api}/offersByUser/${giverId}`).
      pipe(retry(3)).pipe(catchError(this.errorHandler));
  }


  private errorHandler(error: Error | any): Observable<any> {
    return throwError(error);
  }

  deleteSingleOffer(id: string):Observable<Offer> {
    return this.http.delete<any>(`${this.api}/offers/${id}`).
      pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  update(offer: Offer):Observable<Offer> {
    return this.http.put<Offer>(`${this.api}/offers/${offer.id}`, offer).
      pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  create(offer: any):Observable<any> {
    return this.http.post<any>(`${this.api}/saveOffer`, offer).
      pipe(retry(3)).pipe(catchError(this.errorHandler));
  }
}
