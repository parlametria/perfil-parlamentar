import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { LoginService } from '../../shared/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  isLoggedIn: boolean;

  private unsubscribe = new Subject();

  constructor(private loginService: LoginService) { }

  ngOnInit() {
    this.loginService.isLoggedIn().pipe(takeUntil(this.unsubscribe)).subscribe(res =>
      this.isLoggedIn = res
    );
  }

  loginUserGoogle() {
    this.loginService.loginUserGoogle();
  }

  loginUserFacebook() {
    this.loginService.loginUserFacebook();
  }

  logoutUser() {
    this.loginService.logoutUser();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
