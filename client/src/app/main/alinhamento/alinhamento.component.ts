import { Component, OnInit } from "@angular/core";

import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { UserService } from "src/app/shared/services/user.service";
import { AlinhamentoService } from "src/app/shared/services/alinhamento.service";
import { Parlamentar } from "src/app/shared/models/parlamentar.model";

@Component({
  selector: "app-alinhamento",
  templateUrl: "./alinhamento.component.html",
  styleUrls: ["./alinhamento.component.scss"]
})
export class AlinhamentoComponent implements OnInit {
  readonly VIEW_SM = "sm";
  readonly VIEW_MD = "md";
  readonly VIEW_LG = "lg";

  parlamentares: Parlamentar[];
  p: number = 1;
  view: string;

  filtro: any;

  private unsubscribe = new Subject();

  constructor(
    private userService: UserService,
    public alinhamentoService: AlinhamentoService
  ) {}

  ngOnInit() {
    this.view = this.VIEW_LG;
    this.getParlamentares();
  }

  getParlamentares() {
    this.userService
      .getRespostas()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        respostas => {
          this.alinhamentoService
            .get(respostas)
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(
              parlamentares => {
                this.parlamentares = parlamentares;
              },
              error => console.log(error)
            );
        },
        error => console.log(error)
      );
  }

  search(filtro: any) {
    this.filtro = filtro;
    this.alinhamentoService.search(filtro);
  }

  onFollow(following: boolean) {
    console.log(following);
  }

  pageChange(p: number) {
    this.p = p;
  }

  getParlamentarPosition(
    index: number,
    itensPerPage: number,
    currentPage: number
  ) {
    return (itensPerPage * (currentPage - 1)) + index + 1;
  }

  setView(view: string) {
    this.view = view;
  }
}
