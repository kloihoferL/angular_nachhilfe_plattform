import { Component, ElementRef } from '@angular/core';
import { AuthentificationService } from '../shared/authentification.service';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink
  ],
  templateUrl: './navbar.component.html',
  styles: ``
})
export class NavbarComponent {

  isProfileMenuOpen = false;

  constructor(public authService: AuthentificationService) {} // public, damit im Template nutzbar





}
