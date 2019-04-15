import { Component, OnInit } from '@angular/core';

import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  userAuthenticated: boolean;
  user: any;

  constructor(private loginService: LoginService) {}

  ngOnInit() {
    this.loginService.isLoggedIn().subscribe(res => {
      this.userAuthenticated = res;
      this.user = this.loginService.getCurrentUser();
    });
  }

  logoutUser() {
    this.loginService.logoutUser();
  }
}
