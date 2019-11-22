import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { LoginService } from '../../services/login.service';
import { CasaService } from '../../services/casa.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {

  private unsubscribe = new Subject();

  userAuthenticated: boolean;
  user: any;
  casa: string;

  constructor(
    private loginService: LoginService,
    public casaService: CasaService) { }

  ngOnInit() {
    this.loginService.isLoggedIn().pipe(takeUntil(this.unsubscribe)).subscribe(res => {
      this.userAuthenticated = res;
      this.user = this.loginService.getCurrentUser();
    });
    this.casaService.get().pipe(takeUntil(this.unsubscribe)).subscribe(casa => this.casa = casa);
  }

  logoutUser() {
    this.loginService.logoutUser();
  }

  getCasa() {
    return this.casa;
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
