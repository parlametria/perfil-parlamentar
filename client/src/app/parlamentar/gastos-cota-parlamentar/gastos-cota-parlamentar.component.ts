import { Component, OnInit } from '@angular/core';
import { ParlamentarService } from '../../shared/services/parlamentar.service';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { JarbasService } from '../../shared/services/jarbas.service';
import { ParlamentarInfo } from '../../shared/models/parlamentarInfo.model';
import { ExpenseModel } from '../../shared/models/jarbas.models';

@Component({
  selector: 'app-gastos-cota-parlamentar',
  templateUrl: './gastos-cota-parlamentar.component.html',
  styleUrls: ['./gastos-cota-parlamentar.component.scss']
})
export class GastosCotaParlamentarComponent implements OnInit {

  isFirstTimeLoading: boolean;
  isLoading: boolean;
  enableRetry: boolean;
  retryMethod: any;

  politicianId: string;
  politicianJarbasId: number;
  parlamentarInfo: ParlamentarInfo;

  expenses: Array<ExpenseModel> = [];
  totalExpenses: number;
  totalVisibleExpenses = 0;
  hasMoreExpenses: boolean;
  nextExpensesPage = 0;

  constructor(
    private activatedroute: ActivatedRoute,
    private jarbasService: JarbasService,
    private parlamentarService: ParlamentarService,
  ) { }

  ngOnInit(): void {
    this.activatedroute.parent.params
      .pipe(take(1))
      .subscribe(params => {
        this.isFirstTimeLoading = true;
        this.politicianId = params.id;
        this.retryMethod = this.getPoliticianInfoAndExpenses;
        this.getPoliticianInfoAndExpenses()
      });
  }

  getPoliticianInfoAndExpenses() {
    this.parlamentarService
      .getInfoById(this.politicianId)
      .pipe(take(1))
      .subscribe(
        parlamentar => {
          this.hasMoreExpenses = false;
          this.parlamentarInfo = parlamentar;
          this.retryMethod = this.getPoliticianExpenses;
          this.getPoliticianExpenses();
        },
        err => this.handleRequestError(err),
      )
  }

  getPoliticianExpenses() {
    this.jarbasService
      .getJarbasApplicantId(this.parlamentarInfo.nomeEleitoral)
      .subscribe(
        applicantId => {
          if (!applicantId) {
            this.handleRequestFinished();
            return;
          }
          this.politicianJarbasId = applicantId;
          this.retryMethod = this.fetchExpensesBatch;
          this.fetchExpensesBatch();
        },
        err => this.handleRequestError(err),
      );
  }

  fetchExpensesBatch(){
    this.jarbasService
      .getExpenses(this.politicianJarbasId, this.nextExpensesPage)
      .subscribe(
        response => {
          this.totalExpenses = response.count;
          this.hasMoreExpenses = response.next && true;
          this.nextExpensesPage += 1;
          this.expenses.push(...response.results);
          this.totalVisibleExpenses += response.results.length;
          this.handleRequestFinished();
        },
        err => this.handleRequestError(err),

      )
  }

  handleRequestError(error) {
    console.log('Erro buscando dados: ', error);
    this.isFirstTimeLoading = false;
    this.isLoading = false;
    this.enableRetry = true;
  }

  handleRequestFinished() {
    this.isFirstTimeLoading = false;
    this.isLoading = false;
    this.enableRetry = false;
  }

  onClickRetryButton() {
    this.isLoading = true;
    this.retryMethod();
  }

  onClickLoadMoreButton() {
    this.isLoading = true;
    this.fetchExpensesBatch();
  }

  trackById(item) {
    return item.documentId;
  }
}
