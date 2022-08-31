import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { LazyLoadImageModule, intersectionObserverPreset } from 'ng-lazyload-image';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SharedModule } from '../shared/components/shared.module';
import { ParlamentarRoutingModule } from './parlamentar-routing.module';

import { ParlamentarComponent } from './parlamentar.component';
import { PosicaoComponent } from './posicao/posicao.component';
import { CargoComponent } from './cargo/cargo.component';
import { PosicoesComponent } from './posicoes/posicoes.component';
import { CargosComponent } from './cargos/cargos.component';
import { AderenciaComponent } from './aderencia/aderencia.component';
import { VotacoesComponent } from './votacoes/votacoes.component';
import { VotacaoComponent } from './votacao/votacao.component';
import { CapitalComponent } from './capital/capital.component';
import { CapitalChartComponent } from './capital-chart/capital-chart.component';
import { TrajetoriaComponent } from './trajetoria/trajetoria.component';
import { PatrimonioComponent } from './patrimonio/patrimonio.component';
import { PatrimonioChartComponent } from './patrimonio-chart/patrimonio-chart.component';
import { TrajetoriaTimelineComponent } from './trajetoria-timeline/trajetoria-timeline.component';
import { DespesasCotaParlamentarComponent } from './despesas-cota-parlamentar/despesas-cota-parlamentar.component';
import { CardReembolsoComponent } from './card-reembolso/card-reembolso.component';
import { VinculosComponent } from './vinculos/vinculos.component';

@NgModule({
  declarations: [
    ParlamentarComponent,
    PosicaoComponent,
    CargoComponent,
    PosicoesComponent,
    CargosComponent,
    AderenciaComponent,
    VotacoesComponent,
    VotacaoComponent,
    CapitalComponent,
    CapitalChartComponent,
    TrajetoriaComponent,
    PatrimonioComponent,
    PatrimonioChartComponent,
    TrajetoriaTimelineComponent,
    DespesasCotaParlamentarComponent,
    CardReembolsoComponent,
    VinculosComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    LazyLoadImageModule.forRoot({
      preset: intersectionObserverPreset
    }),
    NgbModule,
    SharedModule,
    ParlamentarRoutingModule
  ]
})
export class ParlamentarModule { }
