import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Router } from '@angular/router';


import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { LoginService } from '../services/login.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    private loginService: LoginService,
    private router: Router
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    request = request.clone({
      setHeaders: {
        Authorization: `${this.loginService.getToken()}`
      }
    });

    return next.handle(request).pipe(tap((event: HttpEvent<any>) => {
    }, (err: any) => {
      if (err instanceof HttpErrorResponse) {
        // Handle Unauthorized
        if (err.status === 401) {
          this.loginService.logoutUser();
          this.router.navigate(['/usuario/login']);
        }
      }
    }));
  }

}
