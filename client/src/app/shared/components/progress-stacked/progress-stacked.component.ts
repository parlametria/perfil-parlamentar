import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-progress-stacked',
  templateUrl: './progress-stacked.component.html',
  styleUrls: ['./progress-stacked.component.scss']
})
export class ProgressStackedComponent implements OnInit {
  @Input() titulo: string;
  @Input() total: number;
  @Input() concordancia: number;
  @Input() discordancia: number;
  @Input() passo: number;

  min: number;
  max: number;

  constructor() {
    this.min = 0;
    this.max = 100;
  }

  ngOnInit() {
  }

  getPasso() {

  }

  getConcordancia() {
    return this.concordancia * this.passo;
  }

  getDiscordancia() {
    return this.discordancia * this.passo;
  }

  getComplementar() {
    return this.total - (this.concordancia + this.discordancia);
  }

  getComplementarRelativo() {
    return this.getComplementar() * this.passo;
  }

}
