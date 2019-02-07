import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthService, GoogleLoginProvider, FacebookLoginProvider } from "angularx-social-login";

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private url = environment.apiUrl + 'auth';

  constructor(
    private http: HttpClient,
    private socialAuthService: AuthService
  ) { }

  loginUserGoogle() {
    let socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;

    this.socialAuthService.signIn(socialPlatformProvider).then(
      (userData) => {
        this.loginUserApi("google", userData.authToken).subscribe(
          (res: any) => {
            let token = res.headers.get("authorization");            
            this.setSession(token);
          },
          (error) => console.log(error)
        );
      }
    ).catch(err => console.log(err));
  }

  loginUserFacebook() {
    let socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;

    this.socialAuthService.signIn(socialPlatformProvider).then(
      (userData) => {
        this.loginUserApi("facebook", userData.authToken).subscribe(
          (res: any) => {
            let token = res.headers.get("authorization");            
            this.setSession(token);
          },
          (error) => console.log(error)
        );
      }
    ).catch(err => console.log(err));
  }

  logoutUser() {
    this.socialAuthService.signOut();
    localStorage.removeItem("accessToken");
  }

  getToken() {
    return localStorage.getItem("accessToken");
  }

  private loginUserApi(provider: string, token: string) {
    return this.http.post(
      this.url + "/" + provider,
      { access_token: token, respostas: {} },
      { observe: 'response' }
    )
  }

  private setSession(token) {
    localStorage.setItem("accessToken", token);
  }

}
