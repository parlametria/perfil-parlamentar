import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { UserService } from '../../shared/services/user.service';
import { TemaService } from '../../shared/services/tema.service';

import { Tema } from '../../shared/models/tema.model';
import { LoginService } from '../../shared/services/login.service';

@Component({
  selector: 'app-questionario',
  templateUrl: './questionario.component.html',
  styleUrls: ['./questionario.component.scss']
})
export class QuestionarioComponent implements OnInit, OnDestroy {

  private unsubscribe = new Subject();

  receivedTemas: string[];
  temas: Tema[];

  showQuestionario: boolean = false;

  constructor(
    private userService: UserService,
    private temaService: TemaService,
    private loginService: LoginService
  ) { }

  ngOnInit() {
    this.getTemas();

  }

  getTemas() {    
    this.temaService.getTemas().pipe(takeUntil(this.unsubscribe)).subscribe((temas) => {
      this.temas = temas;
      this.getTemasUsuario();
    });
  }

  getTemasUsuario() {
    if (this.loginService.isUserLogged()) {
      //TODO: se usuario estiver logado.      
    } else {
      let temasLS = this.userService.getTemasLocalStorage();

      if (temasLS) {
        // Transforma o Array de nomes dos temas selecionados em um Array de IDs dos temas selecionados
        let temasPreferidos = temasLS.map((temaValue) => {
          return this.temas.filter((value) => {
            return value.tema === temaValue;
          })[0].id;
        });
        
        // Define qual o restante dos temas para questionário
        let notSelectedTemas = this.temas.filter((tema) => {
          return !temasPreferidos.includes(tema.id);
        }).map(tema => tema.id);

        this.receivedTemas = temasPreferidos.concat(notSelectedTemas);
        this.showQuestionario = true;
      }
      
    }
  }



  receiveTemas($event) {

    let temasSelecionados = $event.selectedTemas

    // Transforma o Array de IDs de temas selecionados em um Array de nomes dos temas selecionados
    let temasPreferidos = temasSelecionados.map((temaID) => {
      return this.temas.filter((value) => {
        return value.id === temaID;
      })[0].tema;
    });

    // Atualiza temas do usuário
    this.userService.setTemas(temasPreferidos);

    this.receivedTemas = $event.allTemas;
    this.showQuestionario = true;
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
