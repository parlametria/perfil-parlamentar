import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared/components/shared.module';
import { QuestionarioRoutingModule } from './questionario-routing.module';

import { PerguntasContainerComponent } from './perguntas-container/perguntas-container.component';
import { PerguntaComponent } from './pergunta/pergunta.component';
import { QuestionarioComponent } from './questionario.component';
import { TemasComponent } from './temas/temas.component';

@NgModule({
  declarations: [
    PerguntasContainerComponent,
    PerguntaComponent,
    QuestionarioComponent,
    TemasComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    SharedModule,
    QuestionarioRoutingModule
  ]
})
export class QuestionarioModule { }
