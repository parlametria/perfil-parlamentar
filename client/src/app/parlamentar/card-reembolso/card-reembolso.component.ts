import { Component, Input } from '@angular/core';
import { ExpenseModel } from '../../shared/models/jarbas.models';

@Component({
  selector: 'app-card-reembolso',
  templateUrl: './card-reembolso.component.html',
  styleUrls: ['./card-reembolso.component.scss']
})
export class CardReembolsoComponent {

  @Input() expenseDetails: ExpenseModel;

  getFormattedDate() {
    let day = this.expenseDetails.issueDay.toString();
    let month = this.expenseDetails.issueMonth.toString();
    const year = this.expenseDetails.issueYear.toString();
    if (day.length < 2) day = '0' + day;
    if (month.length < 2) month = '0' + month;
    return day + '/' + month + '/' + year;
  }

  getFormattedTotalNetValue() {
    return this.expenseDetails.totalNetValue
      .toFixed(2)
      .split('.').
      join(',')
  }

  getFormattedSupplierTaxpayerId() {
    const taxpayerId = this.expenseDetails.supplierCnpjOrCpf;
    if (!taxpayerId) return '-';
    if(taxpayerId.length < 11){
      return taxpayerId.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    }
    return taxpayerId.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
  }
}
