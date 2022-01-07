import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { ExpensesResponse, JarbasApplicantsResponse } from '../models/jarbas.models';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class JarbasService {

  private url = 'https://jarbas.serenata.ai/api/';

  constructor(private http: HttpClient) { }

  getJarbasApplicantId(congresspersonName: string): Observable<number> {
    const endpoint = 'chamber_of_deputies/applicant/';
    return this.http.get<JarbasApplicantsResponse>(this.url + endpoint + '?q=' + congresspersonName)
      .pipe(take(1))
      .pipe(map(jarbasResponse => {
        const [firstApplicant] = jarbasResponse.results;
        if (firstApplicant) {
          return  firstApplicant.applicant_id;
        }
      }));
  }

  getExpenses(jarbasApplicantId: number, pageNumber: number = 0): Observable<ExpensesResponse> {
    const maxPerPage = 25;
    const endpoint = 'chamber_of_deputies/reimbursement/';
    const filters = [
      'applicant_id=' + jarbasApplicantId,
      'limit=' + maxPerPage,
      'offset=' + maxPerPage * pageNumber,
      'format=json',
    ];
    return this.http.get<ExpensesResponse>(this.url + endpoint + '?' + filters.join('&'))
      .pipe(take(1))
      .pipe(map(jarbasResponse => new ExpensesResponse(jarbasResponse)));
  }

}
