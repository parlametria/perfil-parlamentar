import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../shared/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
      
  isLoggedIn: boolean;

  constructor(private loginService: LoginService) { }

  ngOnInit() {
    this.loginService.isLoggedIn().subscribe(res => 
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

}
