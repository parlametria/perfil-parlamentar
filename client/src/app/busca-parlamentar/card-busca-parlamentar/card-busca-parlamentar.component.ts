import { Component, Input } from '@angular/core';

import { Parlamentar } from 'src/app/shared/models/parlamentar.model';

@Component({
  selector: 'app-card-busca-parlamentar',
  templateUrl: './card-busca-parlamentar.component.html',
  styleUrls: ['./card-busca-parlamentar.component.scss']
})
export class CardBuscaParlamentarComponent {

  readonly VIEW_SM = 'sm';
  readonly VIEW_MD = 'md';

  @Input() parlamentar: Parlamentar;
  @Input() view: string;

  constructor() { }

}
