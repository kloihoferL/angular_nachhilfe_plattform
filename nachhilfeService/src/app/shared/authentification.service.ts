import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {jwtDecode} from 'jwt-decode';



interface Token{
  exp:number,
  user:{
    id:string;
    role: string;
  }
}

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {
  private api ="http://nachhilfeservice.s2210456016.student.kwmhgb.at/api/auth";

  constructor(private http:HttpClient) { } //httpClient injizieren

  login(email:string, password:string){
    return this.http.post(`${this.api}/login`, {email, password})
  }


  logout(){
    //logout auf dem server
    this.http.post(`${this.api}/logout`, {});
    //am client ausloggen
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("userRole");
  }

  public isLoggedIn():boolean{
    //überprüfen, ob der Benutzer eingeloggt ist -> also ob token vorhandne ist
    if(sessionStorage.getItem("token")){
      let token:string = <string>sessionStorage.getItem("token");
      const decodedToken = jwtDecode(token) as Token;
      let expirationDate = new Date(0);
      expirationDate.setUTCSeconds(decodedToken.exp); //
      console.log(expirationDate);
      if(expirationDate < new Date()){
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("userId");
        sessionStorage.removeItem("userRole");
        return false;
      }
      return true;
    }else{
      return false;
    }
  }

  public getCurrentUserId(): string {
    return sessionStorage.getItem("userId") || "";
  }
  public getCurrentUserRole():string{
    return <string>sessionStorage.getItem("userRole") || "user";
  }

  setSessionStorage(access_token: string) {
    console.log(jwtDecode(access_token));
    const decodedToken = jwtDecode(access_token) as Token; //casten auf Token in login.ts
    sessionStorage.setItem("token", access_token);
    sessionStorage.setItem("userId", decodedToken.user.id);
    sessionStorage.setItem("userRole", decodedToken.user.role);

  }
}

