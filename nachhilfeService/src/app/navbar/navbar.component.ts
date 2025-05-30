import { Component } from '@angular/core';
import { AuthentificationService } from '../shared/authentification.service';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styles: ``
})
export class NavbarComponent {
  isMobileMenuOpen = false;
  isUserMenuOpen = false;

  constructor(public authService: AuthentificationService) {} // public, damit im Template nutzbar


  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }
}
