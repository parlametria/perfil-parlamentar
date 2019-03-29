import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { Subject } from "rxjs";
import { takeUntil, take } from "rxjs/operators";

import { ParlamentarService } from "./../../shared/services/parlamentar.service";
import { TemaService } from "./../../shared/services/tema.service";
import { PerguntaService } from "./../../shared/services/pergunta.service";
import { UserService } from "./../../shared/services/user.service";

import { Parlamentar } from "src/app/shared/models/parlamentar.model";
import { Tema } from "src/app/shared/models/tema.model";
import { Proposicao } from "src/app/shared/models/proposicao.model";
import { Resposta } from "src/app/shared/models/resposta.model";

@Component({
  selector: "app-parlamentar",
  templateUrl: "./parlamentar.component.html",
  styleUrls: ["./parlamentar.component.scss"]
})
export class ParlamentarComponent implements OnInit {
  readonly FAVOR = 1;
  readonly CONTRA = -1;

  private unsubscribe = new Subject();

  parlamentar: Parlamentar;
  temas: Tema[];
  proposicoes: Proposicao[];
  respostas: Resposta;
  temaSelecionado: string;
  proposicoesFiltradas: Proposicao[];

  constructor(
    private route: ActivatedRoute,
    private parlamentarService: ParlamentarService,
    private temaService: TemaService,
    private perguntaService: PerguntaService,
    private userService: UserService
  ) {}

  ngOnInit() {
    let cpf = this.route.snapshot.paramMap.get("cpf");

    this.getParlamentarByCpf(cpf);
    this.getTemas();
    this.getProposicoes();
    this.getRespostas();
  }

  getParlamentarByCpf(cpf: string) {
    this.parlamentarService
      .getVotacoesParlamentarPorCpf(cpf)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        parlamentar => {
          this.parlamentar = parlamentar;
        },
        error => {
          console.log(error);
        }
      );
  }

  getTemas() {
    this.temaService
      .getTemas()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        temas => {
          this.temas = temas;
          let all_temas = {
            id: "7",
            tema: "Todos os temas",
            slug: "todos"
          };
          this.temas.push(all_temas);
          this.temaSelecionado = "7";
        },
        error => console.log(error)
      );
  }

  getProposicoes() {
    this.perguntaService
      .getProposicoes()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        proposicoes => {
          this.proposicoes = proposicoes;
          this.proposicoesFiltradas = proposicoes;
        },
        error => console.log(error)
      );
  }

  getRespostas() {
    this.userService
      .getRespostas()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        respostas => {
          this.respostas = respostas;
        },
        error => {
          console.log(error);
        }
      );
  }

  onTemaChange() {
    if (this.temaSelecionado === "7") {
      this.proposicoesFiltradas = this.proposicoes;
    } else {
      this.proposicoesFiltradas = this.proposicoes.filter(proposicao => {
        return proposicao.tema_id === Number(this.temaSelecionado);
      });
    }
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
