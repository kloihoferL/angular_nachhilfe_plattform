import { Injectable } from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, withInterceptors} from '@angular/common/http';
import {Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor() { }


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = req.clone({
      setHeaders: { //in den Header der Anfrage den Token hinzufügen
        Authorization: `Bearer ${sessionStorage.getItem("token")}` //hier den token aus dem sessionStorage holen
      }
    });

    return next.handle(req); //request an den nächsten Handler weitergeben
  }
}
