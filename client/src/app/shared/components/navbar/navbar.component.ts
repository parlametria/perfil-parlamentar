import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  userAuthenticated: boolean;
  user: any;

  private unsubscribe = new Subject();

  constructor(private loginService: LoginService) { }

  ngOnInit() {
    this.loginService.isLoggedIn().pipe(takeUntil(this.unsubscribe)).subscribe(res => {
      this.userAuthenticated = res;
      this.user = this.loginService.getCurrentUser();
    });
  }

  logoutUser() {
    this.loginService.logoutUser();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
