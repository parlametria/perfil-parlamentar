import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-patrimonio-chart',
  template: '<p class="text-center">Todo: adicionar gráfico aqui: {{patrimonio}}</p>',
  styleUrls: ['./patrimonio-chart.component.scss']
})
export class PatrimonioChartComponent implements OnInit {

  @Input() patrimonio: any;

  constructor() { }

  ngOnInit() {
  }

}
