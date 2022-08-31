import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ParlamentarService } from '../../shared/services/parlamentar.service';
import { PerfilPoliticoService } from '../../shared/services/perfil-politico.service';

@Component({
  selector: 'app-patrimonio',
  templateUrl: './patrimonio.component.html',
  styleUrls: ['./patrimonio.component.scss']
})
export class PatrimonioComponent implements OnInit {

  medianaPatrimonio: any;
  patrimonio: any;
  temPatrimonio: boolean;
  requestError: boolean;
  isLoading: boolean;

  constructor(
    private activatedroute: ActivatedRoute,
    private perfilPoliticoService: PerfilPoliticoService,
    private parlamentarService: ParlamentarService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.activatedroute.parent.params.pipe(take(1)).subscribe(params => {
      this.getPerfilPolitico(params.id);
    });
  }

  getPerfilPolitico(id) {
    this.parlamentarService
      .getInfoById(id)
      .pipe(take(1))
      .subscribe(
        parlamentar => {
          if (parlamentar.idPerfilPolitico) {
            this.perfilPoliticoService
              .get(parlamentar.idPerfilPolitico)
              .pipe(take(1))
              .subscribe(
                resp => this.handleRequestResponse(resp),
                err => this.handleRequestError(err),
              );
          }
        },
        err => this.handleRequestError(err),
      )
  }

  handleRequestResponse(resp) {
    this.perfilPoliticoService.getAssetStats()
      .pipe(take(1))
      .subscribe(
        stats => {
          const patrimonio = resp.asset_history || [];
          this.requestError = false;
          this.patrimonio = patrimonio;
          this.temPatrimonio = patrimonio.length > 0;
          this.medianaPatrimonio = stats.mediana_patrimonios;
          this.isLoading = false;
        }
      );
  }

  handleRequestError(error) {
    console.log('Erro ao buscar parlamentar: ', error);
    this.temPatrimonio = false;
    this.requestError = true;
    this.isLoading = false;
  }

  onClickModal(content): void {
    this.modalService.open(content, {ariaLabelledBy: 'Sobre'});
  }
}
