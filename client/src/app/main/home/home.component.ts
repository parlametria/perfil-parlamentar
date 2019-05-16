import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { LoginService } from 'src/app/shared/services/login.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  isLoggedIn: boolean;

  private unsubscribe = new Subject();

  constructor(private loginService: LoginService) { }

  ngOnInit() {
    this.loginService.isLoggedIn().pipe(takeUntil(this.unsubscribe)).subscribe(res =>
      this.isLoggedIn = res
    );
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
