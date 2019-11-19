import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';

import { ParlamentarService } from 'src/app/shared/services/parlamentar.service';
import { PerfilPoliticoService } from 'src/app/shared/services/perfil-politico.service';

@Component({
  selector: 'app-trajetoria',
  templateUrl: './trajetoria.component.html',
  styleUrls: ['./trajetoria.component.scss']
})
export class TrajetoriaComponent implements OnInit {

  private unsubscribe = new Subject();

  trajetoria: any;

  constructor(
    private activatedroute: ActivatedRoute,
    private parlamentarService: ParlamentarService,
    private perfilPoliticoService: PerfilPoliticoService) { }

  ngOnInit() {
    this.activatedroute.parent.params.pipe(take(1)).subscribe(params => {
      this.getPerfilPolitico(params.id);
    });
  }

  getPerfilPolitico(id) {
    this.parlamentarService
      .getInfoById(id)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        parlamentar => {
          this.perfilPoliticoService
            .get(parlamentar.idPerfilPolitico)
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(
              trajetoria => this.trajetoria = trajetoria
            );
        },
        error => {
          console.log(error);
        }
      );
  }

}
