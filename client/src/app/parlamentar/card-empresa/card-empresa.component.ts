import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-empresa',
  templateUrl: './card-empresa.component.html',
  styleUrls: ['./card-empresa.component.scss']
})
export class CardEmpresaComponent {

  @Input() company: any;
  @Input() economicSectorColor: string;

  constructor() { }

  getFormattedSupplierTaxpayerId() {
    const taxpayerId = this.company.cnpj;
    if (!taxpayerId) return '-';
    if(taxpayerId.length <= 15) {
      return taxpayerId.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
    }
    return taxpayerId;
  }

  checkIfNeedsMoreContrast() {
    const hexColor = this.economicSectorColor.slice(1);
    const r = parseInt(hexColor.substr(0,2),16);
    const g = parseInt(hexColor.substr(2,2),16);
    const b = parseInt(hexColor.substr(4,2),16);
    const yiq = ((r*299)+(g*587)+(b*114))/1000;
    return yiq >= 186;
  }
}
