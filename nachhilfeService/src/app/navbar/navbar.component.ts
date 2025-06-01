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

  constructor(public authService: AuthentificationService, private elementRef: ElementRef) {} // public, damit im Template nutzbar
  toggleMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  closeProfileMenu() {
    this.isProfileMenuOpen = false;
  }

  // Schließt Menü bei Klick außerhalb
  onClickOutside(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closeProfileMenu();
    }
  }



}
