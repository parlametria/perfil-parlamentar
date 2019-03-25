import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Parlamentar } from 'src/app/shared/models/parlamentar.model';

@Component({
  selector: 'app-card-parlamentar',
  templateUrl: './card-parlamentar.component.html',
  styleUrls: ['./card-parlamentar.component.scss']
})
export class CardParlamentarComponent {

  @Input() id: number
  @Input() parlamentar: Parlamentar
  @Output() followChecked = new EventEmitter<boolean>();

  following: boolean = false;

  constructor() { }

  toggleFollow() {
    this.following = !this.following;
    this.followChecked.emit(this.following);
  }

}
