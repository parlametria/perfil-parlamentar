import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-vinculos',
  templateUrl: './vinculos.component.html',
  styleUrls: ['./vinculos.component.scss']
})
export class VinculosComponent implements OnInit {

  isLoading = false; // todo -> change value according to the state of data request
  requestError = false; // todo -> change value according to the state of data request

  constructor(
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
  }

  onClickModal(content): void {
    this.modalService.open(content, {ariaLabelledBy: 'Sobre'});
  }
}
