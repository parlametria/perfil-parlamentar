import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { take } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { ParlamentarService } from '../../shared/services/parlamentar.service';
import { PerfilPoliticoService } from '../../shared/services/perfil-politico.service';
import { EmpresasRelacionadas } from '../../shared/models/empresasRelacionadas.model';

@Component({
  selector: 'app-vinculos',
  templateUrl: './vinculos.component.html',
  styleUrls: ['./vinculos.component.scss']
})
export class VinculosComponent implements OnInit {

  isLoading = false;
  requestError = false;

  relatedCompanies: EmpresasRelacionadas;
  companiesOwnedByPolitician: Array<any>;

  constructor(
    private modalService: NgbModal,
    private activatedroute: ActivatedRoute,
    private perfilPoliticoService: PerfilPoliticoService,
    private parlamentarService: ParlamentarService,
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.activatedroute.parent.params
      .pipe(take(1))
      .subscribe(params => this.getPoliticianRelatedCompanies(params.id));
  }

  getPoliticianRelatedCompanies(politicianId: string) {
    this.parlamentarService
      .getInfoById(politicianId)
      .pipe(take(1))
      .subscribe(
        parlamentar => {
          if (parlamentar.idPerfilPolitico) {
            this.perfilPoliticoService
              .getEconomicBonds(parlamentar.idPerfilPolitico)
              .subscribe(
                relatedCompanies => {
                  this.relatedCompanies = relatedCompanies;
                  this.companiesOwnedByPolitician = relatedCompanies.ownedByPolitician;
                  this.handleRequestFinished();
                },
                err => this.handleRequestError(err)
              );
          } else {
            this.handleRequestFinished()
          }
        },
        err => this.handleRequestError(err),
      )
  }

  handleRequestError(error) {
    console.log('Erro buscando dados: ', error);
    this.requestError = true;
    this.isLoading = false;
  }

  handleRequestFinished() {
    this.requestError = false;
    this.isLoading = false;
  }

  hasElectoralDonations(): boolean {
    if (!this.relatedCompanies) return false;
    return this.relatedCompanies.donationsByYear.length !== 0;
  }

  hasAssociatedCompanies(): boolean {
    if (!this.companiesOwnedByPolitician) return false;
    return this.companiesOwnedByPolitician.length !== 0;
  }

  onClickModal(content): void {
    this.modalService.open(content, {ariaLabelledBy: 'Sobre'});
  }
}
