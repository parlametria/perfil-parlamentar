import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  animations: [
    trigger('slide', [
      state('left', style({ transform: 'translateX(100%)' })),
      state('center', style({ transform: 'translateX(0)' })),
      state('right', style({ transform: 'translateX(-100%)' })),
      transition('* => *', animate('500ms cubic-bezier(0.785, 0.135, 0.15, 0.86)'))
    ])
  ]
})
export class AboutComponent implements OnInit {
  private STEPS_LENGTH = 3;

  step: number;

  constructor(private router: Router) { }

  ngOnInit() {
    this.step = 0;
  }

  next() {
    if (this.step < this.STEPS_LENGTH - 1) {
      this.step++;
    } else {
      this.router.navigate(['/congresso/aderencia']);
    }
  }

  setStep(step: number) {
    this.step = step;
  }

  getStep() {
    return this.step;
  }

  getSlide(step: number) {
    if (this.step === step) {
      return 'center';
    }
    if (this.step > step) {
      return 'right';
    }
    return 'left';
  }

}
