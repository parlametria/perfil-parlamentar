import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthService, GoogleLoginProvider, FacebookLoginProvider } from "angularx-social-login";

import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private url = environment.apiUrl + 'auth';
  private sessionEmitter: EventEmitter<any> = new EventEmitter();

  constructor(
    private http: HttpClient,
    private socialAuthService: AuthService,
    private router: Router
  ) { }

  loginUserGoogle() {
    let socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    this.clearUserData();

    this.socialAuthService.signIn(socialPlatformProvider).then(
      (userData) => {
        this.loginUserApi("google", userData.authToken).subscribe(
          (res: any) => {
            let token = res.headers.get("authorization");

            let { id, photo } = res.body;
            let user = {
              id,
              photo
            }

            this.setSession(token, user);
            this.router.navigate(['/']);
          },
          (error) => console.log(error)
        );
      }
    ).catch(err => console.log(err));
  }

  loginUserFacebook() {
    let socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;    
    this.clearUserData();

    this.socialAuthService.signIn(socialPlatformProvider).then(
        (userData) => {
          this.loginUserApi("facebook", userData.authToken).subscribe(
            (res: any) => {
              let token = res.headers.get("authorization");

              let { id, photo } = res.body;
              let user = {
                id,
                photo
              }

              this.setSession(token, user);
              this.router.navigate(['/']);    
            },
            (error) => console.log(error)
          );
        }
      ).catch(err => console.log(err));    
  }

  logoutUser() {
    this.socialAuthService.signOut();
    this.clearUserData();
    
    this.sessionEmitter.emit();
  }

  getToken() {
    return localStorage.getItem("accessToken");
  }

  getCurrentUser() {
    let user = {
      id: localStorage.getItem("id_user"),
      photo: localStorage.getItem("photo_user")
    }
    return user
  }

  isUserLogged() {
    return localStorage.getItem('accessToken') !== null;
  }

  private loginUserApi(provider: string, token: string) {
    return this.http.post(
      this.url + "/" + provider,
      { access_token: token, respostas: { vozAtiva: {}, votacoes: {} } },
      { observe: 'response' }
    )
  }

  private setSession(token, user) {
    localStorage.setItem("accessToken", token);
    localStorage.setItem("id_user", user.id);
    localStorage.setItem("photo_user", user.photo);

    this.sessionEmitter.emit();
  }

  private clearUserData() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("id_user");
    localStorage.removeItem("photo_user");
  }

  getSessionEmitter() {
    return this.sessionEmitter;
  }

}
