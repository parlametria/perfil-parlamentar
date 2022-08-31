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
  supplierCnpjOrCpf: string;
  suspicions: Array<string>;

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
    this.subquotaTypeDescription = ExpenseModel.getTranslatedSubquota(jarbasResponse.subquota_number)
                                    || jarbasResponse.subquota_description;
    this.supplierName = jarbasResponse.supplier;
    this.supplierCnpjOrCpf = jarbasResponse.cnpj_cpf;
    this.suspicions = ExpenseModel.getRosiesSuspicionsList(jarbasResponse.suspicions);
  }

  static getTranslatedSubquota(subquotaId: number): string {
    // Translations from:
    // https://github.com/okfn-brasil/serenata-de-amor/blob/main/jarbas/dashboard/admin/subquotas.py
    switch (subquotaId) {
      case 1:
        return 'Manutenção de escritório de apoio à atividade parlamentar';
      case 2:
        return 'Locomoção, alimentação e  hospedagem';
      case 3:
        return 'Combustíveis e lubrificantes';
      case 4:
        return 'Consultorias, pesquisas e trabalhos técnicos';
      case 5:
        return 'Divulgação da atividade parlamentar';
      case 6:
        return 'Aquisição de material de escritório';
      case 7:
        return 'Aquisição ou loc. de software serv. postais ass.';
      case 8:
        return 'Serviço de segurança prestado por empresa especializada';
      case 9:
        return 'Passagens aéreas';
      case 10:
        return 'Telefonia';
      case 11:
        return 'Serviços postais';
      case 12:
        return 'Assinatura de publicações';
      case 13:
        return 'Fornecimento de alimentação do parlamentar';
      case 14:
        return 'Hospedagem, exceto do parlamentar no distrito federal';
      case 15:
        return 'Locação de veículos automotores ou fretamento de embarcações';
      case 119:
        return 'Locação ou fretamento de aeronaves';
      case 120:
        return 'Locação ou fretamento de veículos automotores';
      case 121:
        return 'Locação ou fretamento de embarcações';
      case 122:
        return 'Serviço de táxi, pedágio e estacionamento';
      case 123:
        return 'Passagens terrestres, marítimas ou fluviais';
      case 137:
        return 'Participação em curso, palestra ou evento similar';
      case 999:
        return 'Emissão bilhete aéreo';
    }
  }

  static getRosiesSuspicionsList(suspicions: object): Array<string> {
    if (!suspicions) return [];
    // Translations from:
    // https://github.com/okfn-brasil/serenata-de-amor/blob/main/jarbas/dashboard/admin/widgets.py
    const translateSuspicion = suspicion => {
      switch (suspicion) {
        case 'meal_price_outlier':
          return 'Preço de refeição muito incomum';
        case 'over_monthly_subquota_limit':
          return 'Extrapolou limita da (sub)quota';
        case 'suspicious_traveled_speed_day':
          return 'Muitas despesas em diferentes cidades no mesmo dia';
        case 'invalid_cnpj_cpf':
          return 'CPF ou CNPJ inválidos';
        case 'election_expenses':
          return 'Gasto com campanha eleitoral';
        case 'irregular_companies_classifier':
          return 'CNPJ irregular';
        default:
          return suspicion;
      }
    };
    return Object.keys(suspicions)
      .filter(key => suspicions[key]) // get only suspicions marked as 'true'
      .map(suspicion => translateSuspicion((suspicion)))

  }

  getJarbasPanelUrl() {
    if (!this.documentId) return;
    return 'https://jarbas.serenata.ai/layers/#/documentId/' + this.documentId
  }
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

