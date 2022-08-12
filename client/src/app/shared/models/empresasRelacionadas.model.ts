import * as d3 from 'd3';
import {
  economicSectorMapping,
  CNAE_MISSING_IN_MAPPING,
  WITHOUT_CNAE,
} from '../constants/economicSectors';

function mapEconomicSector(cnaeCode) {
  if (!cnaeCode) return WITHOUT_CNAE;
  for (const sector of economicSectorMapping) {
    if(sector.codes.includes(`${cnaeCode}`.substr(0,2))) {
      return {name: sector.name, abbrev: sector.abbrev};
    }
  }
  return CNAE_MISSING_IN_MAPPING;
}

function getEconomicSectorFullName(abbrev) {
  if (abbrev === WITHOUT_CNAE.abbrev) return WITHOUT_CNAE.name;
  if (abbrev === CNAE_MISSING_IN_MAPPING.abbrev) return CNAE_MISSING_IN_MAPPING.name;
  for (const sector of economicSectorMapping) {
    if(sector.abbrev === abbrev) {
      return sector.name;
    }
  }
  return CNAE_MISSING_IN_MAPPING.name;
}

export class EmpresasRelacionadas {

  ownedByPolitician: Array<any> = [];
  donationsByYear: Array<any> = [];
  allSectorsAbbrevFromDonations: Array<any> = [];
  allSectorsAbbrevFromOwnedCompanies: Array<any> = [];

  getEconomicSectorColor: any;
  getEconomicSectorFullName = getEconomicSectorFullName;

  constructor(requestResponse: any) {
    this.formatCompaniesOwnedByPolitician(requestResponse.companies_associated_with_politician);
    this.formatDonationsByYear(requestResponse.election_income_history);
    this.generateColorPalette();
  }

  formatCompaniesOwnedByPolitician(companies: Array<any>) {
    const allEconomicSectors = new Set();
    this.ownedByPolitician = companies.map(item => {
      const { name, abbrev } = mapEconomicSector(item.main_cnae);
      allEconomicSectors.add(abbrev);
      return {
        economicSector: name,
        economicSectorAbbrev: abbrev,
        companyName: item.company_name,
        cnpj: item.cnpj,
        uf: item.uf,
        foundationDate: item.foundation_date,
        politicianParticipationStartDate: item.participation_start_date,
      }
    });
    this.allSectorsAbbrevFromOwnedCompanies = Array.from(allEconomicSectors);
  }

  formatDonationsByYear(electionIncome: Array<any>) {
    const allEconomicSectors = new Set();
    const donationsByYear = {};

    electionIncome.forEach(income => {
      if (!income.year || !income.value) return;

      const { name, abbrev } = mapEconomicSector(income.donor_economic_sector_code);
      allEconomicSectors.add(abbrev);
      donationsByYear[income.year] = donationsByYear[income.year] || {};
      donationsByYear[income.year][abbrev] = (donationsByYear[income.year][abbrev] || 0) + income.value;
    });

    const donationYears = Object.keys(donationsByYear);
    donationYears.forEach(key => {
      this.donationsByYear.push({...donationsByYear[key], group: +key})
    });
    this.allSectorsAbbrevFromDonations = Array.from(allEconomicSectors);
  }

  private generateColorPalette() {
    const allSectors = [
      ...new Set([...this.allSectorsAbbrevFromDonations, ...this.allSectorsAbbrevFromOwnedCompanies])
    ];

    console.log('sectors', this.allSectorsAbbrevFromDonations, this.allSectorsAbbrevFromOwnedCompanies, allSectors);
    let colorPalette = [
      '#60409b', '#f36ad5', '#0bbb43', '#ff5900',
      '#48b9e0', '#782d40', '#c7fe40', '#b26df4',
      '#1e3154', '#ffbda3', '#9c191c', '#fea53b',
      '#0f7521', '#a49c8a', '#ff0073', '#395bff',
      '#101010'];

    if (allSectors.length > colorPalette.length) {
      colorPalette = [...colorPalette, ...colorPalette];
    }

    this.getEconomicSectorColor = d3
      .scaleOrdinal()
      .domain(allSectors)
      .range(colorPalette);
  }

}
