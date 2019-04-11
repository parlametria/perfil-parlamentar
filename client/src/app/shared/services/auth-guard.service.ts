import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
    private router: Router,
    private loginService: LoginService
  ) { }

  canActivate() {
    if (this.loginService.isUserLogged()) {
      return true;
    } else {
      this.router.navigate(['/usuario/login']);
      return false;
    }
  }
}
