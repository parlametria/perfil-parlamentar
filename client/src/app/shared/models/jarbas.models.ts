// As most of the var names are using the python pattern,
// it is better to disable the lint in the hole file
// tslint:disable:variable-name

export class JarbasApplicantsResponse {
  count: number;
  next: string;
  previous: string;
  results: Array<JarbasApplicantModel>;
}

class JarbasApplicantModel {
  applicant_id: number;
  congressperson_name: string;
}

export class ExpensesResponse {
  count: number;
  next: string;
  previous: string;
  results: Array<ExpenseModel>;

  constructor(jarbasResponse: any) {
    this.count = jarbasResponse.count;
    this.next = jarbasResponse.next;
    this.previous = jarbasResponse.previous;
    this.results = jarbasResponse.results.map(result => new ExpenseModel(result));
  }
}

export class ExpenseModel {
  documentId: number;
  issueDay: number;
  issueYear: number;
  issueMonth: number;
  totalNetValue: number;
  state: string;
  corruptionProbability: number;
  subquotaTypeCode: number;
  subquotaTypeDescription: string;
  supplierName: any;
  supplierCnpjOrCpf: number;
  suspicions: Array<any>;

  constructor(jarbasResponse: any) {
    const [year, month, day] = (jarbasResponse.issue_date || '').split('-');

    this.documentId = jarbasResponse.document_id;
    this.issueDay = +day;
    this.issueYear = +jarbasResponse.issueYear || +year;
    this.issueMonth = +jarbasResponse.issueMonth || +month;
    this.totalNetValue = jarbasResponse.total_net_value || jarbasResponse.document_value;
    this.state = jarbasResponse.state;
    this.corruptionProbability = jarbasResponse.probability;
    this.subquotaTypeCode= jarbasResponse.subquota_number;
    this.subquotaTypeDescription = jarbasResponse.subquota_description;
    this.supplierName = jarbasResponse.supplier;
    this.supplierCnpjOrCpf = jarbasResponse.cnpj_cpf;
    this.suspicions = jarbasResponse.suspicions;
  }
}
