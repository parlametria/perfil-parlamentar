import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-progress-stacked',
  templateUrl: './progress-stacked.component.html',
  styleUrls: ['./progress-stacked.component.scss']
})
export class ProgressStackedComponent {
  @Input() titulo: string;
  @Input() categorias: any[];
  @Input() passo: number;

  min: number;
  max: number;

  constructor() {
    this.min = 0;
    this.max = 100;
  }

  getClass(classe): string[] {
    const classes = ['progress-bar progress-stacked-bar progress-bordered', classe];
    return classes;
  }

  getValor(valor) {
    return valor * this.passo;
  }

}
