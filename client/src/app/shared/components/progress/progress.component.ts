import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})
export class ProgressComponent implements OnInit {
  @Input() value: number;
  @Input() min: number;
  @Input() max: number;
  @Input() showAxis: boolean;
  @Input() class: string;

  constructor() {}

  ngOnInit() {}

  getClass(): string[] {
    const classes = ['progress-bar', this.class];

    return classes;
  }

}
