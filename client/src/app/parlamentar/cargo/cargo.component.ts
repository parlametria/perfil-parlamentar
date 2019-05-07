import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-cargo',
  templateUrl: './cargo.component.html',
  styleUrls: ['./cargo.component.scss']
})
export class CargoComponent implements OnInit {

  @Input() comissoesByCargo: {};

  constructor() { }

  ngOnInit() {
  }

}
