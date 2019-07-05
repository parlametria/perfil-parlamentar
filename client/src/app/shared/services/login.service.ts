import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { BehaviorSubject } from 'rxjs';
import { AuthService, GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';

import { environment } from '../../../environments/environment';
import { PerguntaService } from './pergunta.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private url = environment.apiUrl + 'auth';
  private loggedIn = new BehaviorSubject<boolean>(this.isUserLogged());

  constructor(
    private http: HttpClient,
    private socialAuthService: AuthService,
    private router: Router,
    private perguntaService: PerguntaService
  ) { }

  loginUserGoogle() {
    const socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    this.clearUserData();

    this.socialAuthService.signIn(socialPlatformProvider).then(
      (userData) => {
        this.loginUserApi('google', userData.authToken);
      }).catch(err => console.log(err));
  }

  loginUserFacebook() {
    const socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    this.clearUserData();

    this.socialAuthService.signIn(socialPlatformProvider).then(
      (userData) => {
        this.loginUserApi('facebook', userData.authToken);
      }).catch(err => console.log(err));
  }

  logoutUser() {
    if (this.isUserLogged()) {
      // Logout if user is authenticated
      const auth = this.socialAuthService.authState.subscribe((user) => {
        if (user !== null) {
          this.socialAuthService.signOut();
        }
      });
      auth.unsubscribe();
    }

    this.clearUserData();
    this.clearRespostaLocalStorage();
    this.clearTemasLocalStorage();
    this.loggedIn.next(false);
  }

  getToken() {
    return localStorage.getItem('accessToken');
  }

  getCurrentUser() {
    const user = {
      id: localStorage.getItem('id_user'),
      full_name: localStorage.getItem('full_name'),
      photo: localStorage.getItem('photo_user')
    };
    return user;
  }

  isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  isUserLogged(): boolean {
    return localStorage.getItem('accessToken') !== null;
  }

  private loginUserApi(provider: string, token: string) {

    // Cria respostas para salvar no BD
    this.perguntaService.getProposicoes().subscribe(
      proposicoes => {
        const votacoes = proposicoes.reduce((result, item) => {
          const key = item.idProposicao;
          result[key] = 0;
          return result;
        }, {});

        const respostasUser = {
          vozAtiva: {},
          votacoes
        };

        // Cria usuário no BD
        this.criaUsuarioAPI(provider, token, respostasUser);
      },
      error => console.log(error)
    );
  }

  private criaUsuarioAPI(provider: string, token: string, respostas: any) {
    this.http.post(
      this.url + '/' + provider,
      { access_token: token, respostas },
      { observe: 'response' }
    ).subscribe(
      (res: any) => {
        const tokenUser = res.headers.get('authorization');

        const { id, full_name, photo } = res.body;
        const user = {
          id,
          full_name,
          photo
        };

        this.setSession(tokenUser, user);
        this.router.navigate(['/']);
      },
      (error) => console.log(error)
    );
  }

  private setSession(token, user) {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('id_user', user.id);
    localStorage.setItem('full_name', user.full_name);
    localStorage.setItem('photo_user', user.photo);
    this.loggedIn.next(true);

  }

  private clearUserData() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('id_user');
    localStorage.removeItem('full_name');
    localStorage.removeItem('photo_user');
  }

  private clearRespostaLocalStorage() {
    localStorage.removeItem('respostasUser');
  }

  private clearTemasLocalStorage() {
    localStorage.removeItem('temasUser');
  }

}
