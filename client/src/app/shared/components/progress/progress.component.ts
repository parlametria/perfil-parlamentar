import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})
export class ProgressComponent implements OnInit, OnChanges {
  @Input() value: number;
  @Input() min: number;
  @Input() max: number;
  @Input() showAxis: boolean;
  @Input() class: string;

  constructor() {}

  ngOnInit() {}

  ngOnChanges() {
    if (this.value < 0) {
      this.value = 0;
    }
  }

  getClass(): string[] {
    const classes = ['progress-bar', this.class];

    return classes;
  }

}
