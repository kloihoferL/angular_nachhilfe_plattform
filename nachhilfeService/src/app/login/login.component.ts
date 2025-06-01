import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthentificationService} from '../shared/authentification.service';

interface Response{
  access_token:string;
}
class AuthenticationService {
}

@Component({
  selector: 'bs-login',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styles: ``
})
export class LoginComponent implements OnInit{

  loginForm:FormGroup;

  constructor(private fb:FormBuilder, private router:Router, private authService:AuthentificationService) {
    this.loginForm = this.fb.group({});
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  login(){
    //emial und pw aus formular auslesen
    const val = this.loginForm.value;
    //überprüfen, ob email und pw korrekt sind
    this.authService.login(val.username, val.password).subscribe(
      (res:any) => {
        console.log(res);
        this.authService.setSessionStorage((res as Response).access_token);//res auf Response casten (interface)
        this.router.navigateByUrl("/");
      }
    )
  }

  isLoggedIn(){
    return this.authService.isLoggedIn();
  }

  //public getCurrenUserId() :number{
  //return Number.parseInt(<string>sessionStorage.getItem("userId") || "-1");
  //}

  logout(){
    this.authService.logout();
    // this.router.navigate(['/login']);
  }



}
