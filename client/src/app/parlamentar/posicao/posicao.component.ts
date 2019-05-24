import { Component, Input, OnInit } from '@angular/core';

import { Parlamentar } from 'src/app/shared/models/parlamentar.model';

@Component({
  selector: 'app-posicao',
  templateUrl: './posicao.component.html',
  styleUrls: ['./posicao.component.scss']
})
export class PosicaoComponent implements OnInit {
  readonly FAVOR = 1;
  readonly CONTRA = -1;

  @Input() parlamentar: Parlamentar;
  @Input() proposicao: any;
  @Input() resposta: any;
  @Input() votacao: any;

  isCollapsed: boolean;

  constructor() {}

  ngOnInit() {
    this.isCollapsed = true;
  }
}
