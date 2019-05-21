import { Component, OnInit, Input } from '@angular/core';

import { getClassCargo } from '../../shared/functions/comissao';

@Component({
  selector: 'app-cargo',
  templateUrl: './cargo.component.html',
  styleUrls: ['./cargo.component.scss']
})
export class CargoComponent implements OnInit {

  @Input() comissoesByCargo: {};

  constructor() { }

  ngOnInit() {
  }

  // Define a classe que será aplicada ao badge que indica o cargo do parlamentar na comissao
  getClassCargoComissao(cargo: string) {
    return getClassCargo(cargo);
  }

}
