import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-pergunta',
  templateUrl: './pergunta.component.html',
  styleUrls: ['./pergunta.component.scss']
})
export class PerguntaComponent implements OnInit {

  @Input() projLei = '';
  @Input() title = '';
  @Input() description = '';
  @Input() id = '';

  isCollapsed: boolean;

  constructor() {
    this.isCollapsed = true;
  }

  ngOnInit() {

  }

}
