import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sticky-footer-navbar',
  templateUrl: './sticky-footer-navbar.component.html',
  styleUrls: ['./sticky-footer-navbar.component.scss']
})
export class StickyFooterNavbarComponent {

  constructor(private router: Router) { }

  isActive(casa: string) {
    return this.router.url.split(/\/|\?/)[2] === casa;
  }

}
