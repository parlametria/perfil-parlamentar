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
  parlamentares: Parlamentar[];
  filtro: any;

  private unsubscribe = new Subject();

  constructor(
    private userService: UserService,
    public alinhamentoService: AlinhamentoService
  ) { }

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
    this.filtro = filtro;
    this.alinhamentoService.search(filtro);
  }

}
