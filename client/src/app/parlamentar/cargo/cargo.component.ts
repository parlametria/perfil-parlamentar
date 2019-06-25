import { Component, Input, SimpleChanges, OnChanges } from '@angular/core';

import { getClassCargo } from '../../shared/functions/comissao';

@Component({
  selector: 'app-cargo',
  templateUrl: './cargo.component.html',
  styleUrls: ['./cargo.component.scss']
})
export class CargoComponent implements OnChanges {

  @Input() cargos: {};

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (
      typeof changes.cargos !== 'undefined' &&
      typeof changes.cargos.currentValue !== 'undefined'
    ) {
      Object.keys(this.cargos).map(cargo => { this.cargos[cargo].classe = getClassCargo(cargo); });
    }
  }

}
