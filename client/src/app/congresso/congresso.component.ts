import { Component, OnInit } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { UserService } from '../shared/services/user.service';
import { AlinhamentoService } from '../shared/services/alinhamento.service';
import { Parlamentar } from 'src/app/shared/models/parlamentar.model';

@Component({
  selector: 'app-congresso',
  templateUrl: './congresso.component.html',
  styleUrls: ['./congresso.component.scss']
})
export class CongressoComponent implements OnInit {
  readonly VIEW_SM = 'sm';
  readonly VIEW_MD = 'md';
  readonly VIEW_LG = 'lg';

  parlamentares: Parlamentar[];
  view: any;
  filter: any;

  private unsubscribe = new Subject();

  constructor(
    private userService: UserService,
    public alinhamentoService: AlinhamentoService
  ) { }

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

  setView(view: string) {
    this.view = view;
  }

  search(filter: any) {
    this.filter = filter;
    this.alinhamentoService.search(filter);
  }

}
