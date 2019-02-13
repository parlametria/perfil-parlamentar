import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-questionario',
  templateUrl: './questionario.component.html',
  styleUrls: ['./questionario.component.scss']
})
export class QuestionarioComponent implements OnInit {

  receivedTemas : string[];

  showQuestionario : boolean = false;

  constructor() { }

  ngOnInit() {
  }

  receiveTemas($event) {
    this.receivedTemas = $event;
    this.showQuestionario = true;
  }

}
