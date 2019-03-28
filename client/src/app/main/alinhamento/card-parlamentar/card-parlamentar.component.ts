import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Parlamentar } from 'src/app/shared/models/parlamentar.model';

@Component({
  selector: 'app-card-parlamentar',
  templateUrl: './card-parlamentar.component.html',
  styleUrls: ['./card-parlamentar.component.scss']
})
export class CardParlamentarComponent implements OnInit {

  readonly VIEW_SM = "sm";
  readonly VIEW_MD = "md";
  readonly VIEW_LG = "lg";

  @Input() id: number;
  @Input() parlamentar: Parlamentar;
  @Input() view: any;
  @Output() followChecked = new EventEmitter<boolean>();

  following: boolean = false;

  constructor() { }

  ngOnInit() {
    this.view = this.VIEW_MD;
  }

  toggleFollow() {
    this.following = !this.following;
    this.followChecked.emit(this.following);
  }

}
