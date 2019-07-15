import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { UserService } from '../shared/services/user.service';
import { TemaService } from '../shared/services/tema.service';

import { Tema } from '../shared/models/tema.model';

@Component({
  selector: 'app-questionario',
  templateUrl: './questionario.component.html',
  styleUrls: ['./questionario.component.scss']
})
export class QuestionarioComponent implements OnInit, OnDestroy {

  private unsubscribe = new Subject();

  receivedTemas: string[];
  temas: Tema[];

  showQuestionario = false;
  showTemasComponent = false;

  constructor(
    private userService: UserService,
    private temaService: TemaService
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
    this.userService.getTemas().then((temas) => {
      if (typeof temas !== 'undefined' && temas.length > 0) {
        const temasPreferidos = this.mapTemasIdToNome(temas);
        const notSelectedTemas = this.joinComTemasNaoSelecionados(temasPreferidos);

        this.receivedTemas = temasPreferidos.concat(notSelectedTemas);
        this.showQuestionario = true;
      } else {
        this.showQuestionario = false;
        this.showTemasComponent = true;
      }
    }).catch((err) => {
      console.log(err);
    });

  }

  receiveTemas($event) {
    const temasSelecionados = $event.selectedTemas;

    // Transforma o Array de IDs de temas selecionados em um Array de nomes dos temas selecionados
    const temasPreferidos = temasSelecionados.map((temaID) => {
      return this.temas.filter((value) => {
        return value.idTema === temaID;
      })[0].tema;
    });

    // Atualiza temas do usuário
    this.userService.setTemas(temasPreferidos).then((res) => {
      this.receivedTemas = $event.allTemas;
      this.showQuestionario = true;
    });
  }

  mapTemasIdToNome(temasNome) {
    const temasId = temasNome.map((temaValue) => {
      return this.temas.filter((value) => {
        return value.tema === temaValue;
      })[0].idTema;
    });

    return temasId;
  }

  joinComTemasNaoSelecionados(temasPreferidos) {
    const notSelectedTemas = this.temas.filter((tema) => {
      return !temasPreferidos.includes(tema.idTema);
    }).map(tema => tema.idTema);

    return notSelectedTemas;
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
