import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';

import { AderenciaService } from 'src/app/shared/services/aderencia.service';

import { Aderencia } from 'src/app/shared/models/aderencia.model';

@Component({
  selector: 'app-aderencia',
  templateUrl: './aderencia.component.html',
  styleUrls: ['./aderencia.component.scss']
})
export class AderenciaComponent implements OnInit, OnDestroy {

  private unsubscribe = new Subject();

  aderencia: Aderencia;
  aderenciaDados: any;

  constructor(
    private aderenciaService: AderenciaService,
    private activatedroute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.activatedroute.parent.params.pipe(take(1)).subscribe(params => {
      this.getAderencia(params.id);
    });
  }

  getAderencia(id: string) {
    this.aderenciaService.
      getAderenciaById(id)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        aderencia => {
          this.aderencia = aderencia;
          this.aderenciaDados = aderencia.parlamentarAderencia.filter(ad => ad.partido === aderencia.partido)[0];
        },
        error => {
          console.log(error);
        }
      );
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
