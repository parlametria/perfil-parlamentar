import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  userAuthenticated: boolean;

  constructor(private loginService: LoginService) { }

  ngOnInit() {
    this.loginService.isLoggedIn().subscribe(res => 
      this.userAuthenticated = res
    );
  }

  logoutUser() {
    this.loginService.logoutUser();    
  }

}
