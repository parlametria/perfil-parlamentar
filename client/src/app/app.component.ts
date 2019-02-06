import { Component, OnInit } from '@angular/core';

import { PerguntaService } from './shared/services/pergunta.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  private perguntas;

  constructor(private perguntasServices: PerguntaService) { }

  ngOnInit() {
    this.perguntasServices.getPerguntas().subscribe(
      (perguntas) => this.perguntas = perguntas,
      (error) => console.log(error));
  }

}
