import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../shared/services/login.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  
  private userLogged;  

  constructor(private loginService: LoginService) { }

  ngOnInit() {
    this.userLogged = this.loginService.isUserLogged();
    
    this.loginService.getSessionEmitter().subscribe(() => {
      this.userLogged = this.loginService.isUserLogged();
    });  
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
