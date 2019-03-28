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
  parlamentares: Parlamentar[];

  p: number = 1;

  private unsubscribe = new Subject();

  constructor(
    private userService: UserService,
    public alinhamentoService: AlinhamentoService
  ) {}

  ngOnInit() {
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
    this.alinhamentoService.search(filtro);
  }

  onFollow(following: boolean) {
    console.log(following);
  }

  pageChange(p: number) {
    console.log(p);

    this.p = p;
  }

  getParlamentarPosition(
    index: number,
    itensPerPage: number,
    currentPage: number
  ) {
    return (itensPerPage * (currentPage - 1)) + index + 1;
  }
}
