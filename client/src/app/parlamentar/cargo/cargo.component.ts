import { Component, Input, SimpleChanges, OnChanges } from '@angular/core';

import { getClassCargo } from '../../shared/functions/comissao';

@Component({
  selector: 'app-cargo',
  templateUrl: './cargo.component.html',
  styleUrls: ['./cargo.component.scss']
})
export class CargoComponent implements OnChanges {

  @Input() comissoesByCargo: {};

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (
      typeof changes.comissoesByCargo !== 'undefined' &&
      typeof changes.comissoesByCargo.currentValue !== 'undefined'
    ) {
      Object.keys(this.comissoesByCargo).map(cargo => { this.comissoesByCargo[cargo].classe = getClassCargo(cargo); });
    }
  }

  // Define a classe que será aplicada ao badge que indica o cargo do parlamentar na comissao
  getClassCargoComissao(cargo: string) {
    return getClassCargo(cargo);
  }

}
