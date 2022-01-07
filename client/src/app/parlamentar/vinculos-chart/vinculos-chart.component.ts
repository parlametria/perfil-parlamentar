import { Component, AfterContentInit, OnChanges, SimpleChanges, Input, ViewEncapsulation } from '@angular/core';

import * as d3 from 'd3';
import d3Tip from 'd3-tip';
import { EmpresasRelacionadas } from '../../shared/models/empresasRelacionadas.model';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-vinculos-chart',
  template: `
    <ul id="legend">
      <li><strong>Setores econômicos:</strong></li>
      <li class="legendItem" [ngClass]="subgroup"
          [style.color]="getColor(subgroup)"
          *ngFor="let subgroup of subgroups"
          (mouseover)="onMouseOverLegend(subgroup)"
          (mouseout)="onMouseOutLegend()">
      ● {{relatedCompanies.getEconomicSectorFullName(subgroup)}}
    </li></ul>
    <div id="vinculos-chart"></div>
  `,
  styleUrls: ['./vinculos-chart.component.scss']
})
export class VinculosChartComponent implements AfterContentInit, OnChanges {

  @Input() relatedCompanies: EmpresasRelacionadas;
  donations: any;
  subgroups: any;

  width: number;
  height: number;
  totalWidth: number;
  totalHeight: number;
  margin: any;

  svg: any;
  g: any;
  x: any;
  y: any;
  setTipContent: any;
  getColor: any;
  tipElectoralBond: any;

  constructor() { }

  ngAfterContentInit(): void {
    const container: any = d3.select('.vinculo-chart-wrapper').node();

    this.width = (container.offsetWidth < 580) ? 300 : 650;
    this.height = 180;
    this.margin = {
      left: 55,
      right: 30,
      top: 30,
      bottom: 30
    };
    this.totalWidth = this.width + this.margin.left + this.margin.right;
    this.totalHeight = this.height + this.margin.top + this.margin.top;
    this.initChart();
    this.initTooltip();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      typeof changes.relatedCompanies !== 'undefined' &&
      typeof changes.relatedCompanies.currentValue !== 'undefined'
    ) {
      this.donations = this.relatedCompanies.donationsByYear;
      this.subgroups = this.relatedCompanies.allSectorsAbbrevFromDonations;
      this.getColor = this.relatedCompanies.getEconomicSectorColor;
      this.drawVis();
    }
  }

  initChart() {
    this.svg = d3
      .select('#vinculos-chart')
      .append('svg')
      .attr('version', '1.1')
      .attr('xmlns:svg', 'http://www.w3.org/2000/svg')
      .attr('xmlns', 'http://www.w3.org/2000/svg')
      .attr('viewBox', '0 0 ' + this.totalWidth + ' ' + this.totalHeight)
      .append('g')
      .attr(
        'transform',
        'translate(' + this.margin.left + ',' + this.margin.top + ')'
      );
  }

  private initTooltip() {
    this.tipElectoralBond = d3Tip()
      .attr('class', 'tip-electoral-bond')
      .attr('id', 'tooltip-electoral-bond')
      .offset([-10, 0])
      .style('font-size', '13px')
      .style('background-color', 'white')
      .style('border', '2px solid #20201e')
      .style('border-radius', '5px')
      .style('padding', '2px');

    const locale = d3.formatLocale({
      decimal: ',',
      thousands: '.',
      grouping: [3],
      currency: ['R$ ', ' ']
    });
    const getFormattedCurrency = locale.format('$,.2f');

    this.setTipContent = (sectorAbbrev, value) => {
      const economicSectorName = this.relatedCompanies.getEconomicSectorFullName(sectorAbbrev);
      this.tipElectoralBond
        .html(
          '<strong>Setor: </strong>' + economicSectorName +
          '<br>' +
          '<strong>Valor: </strong>' + getFormattedCurrency(value)
        )
    };
  }

  drawVis() {
    this.svg.call(this.tipElectoralBond);

    this.plotAxisX();
    this.plotAxisY();
    this.plotBars();
  }

  plotAxisX() {
    const minYear = +d3.min(this.donations, (d: any) => d.group);
    const maxYear = +d3.max(this.donations, (d: any) => d.group);
    const yearsRange = [];
    for (let year = minYear; year <= maxYear; year++) yearsRange.push(year);

    this.x = d3.scaleBand()
      .domain(yearsRange)
      .range([0, this.width])
      .padding(0.2);
    this.svg.append('g')
      .attr('transform', `translate(0, ${this.height})`)
      .call(d3.axisBottom(this.x).tickSizeOuter(0))
      .call(g => g.selectAll('.tick text')
        .attr('color', '#212529')
        .attr('font-weight', '500')
        .attr('font-size', '0.55rem')
        .style('text-anchor', 'end')
        .attr('dx', '-.3em')
        .attr('dy', '.40em')
        .attr('transform', 'rotate(-35)')
      );
  }

  plotAxisY() {
    const numberFormat = d3.format('.2f');

    const donationsPerYear: Array<number> = this.donations.map(
      donation => Object.keys(donation).filter(key => key !== 'group')
        .reduce((accumulator: number, key) => +donation[key] + accumulator, 0)
    );
    const maxValue = +d3.max(donationsPerYear);

    let max = maxValue;
    if (max < 1000) {
      max = 1000;
    } else if (max < 900000) {
      max = 900000;
    } else if (max < 1000000) {
      max = 1000000;
    } else {
      max = Math.ceil(max / 10000000) * 10000000;
    }

    this.y = d3.scaleLinear()
      .range([ this.height, 0 ])
      .domain([0, maxValue])
      .nice();

    this.svg.append('g')
      .attr('color', '#212529')
      .style('font-size', '0.55rem')
      .call(
        d3.axisLeft(this.y)
          .tickFormat((d) => {
            if (d === 0) return;
            let s;
            if (max <= 1000) {
              s = +d;
            } else if (max <= 900000) {
              s = +d / 1000;
            } else {
              s = +d / 1000000;
            }
            if (s.toString().length > 4) {
              s = numberFormat(s);
            }
            return '\xa0' + s;
          })
      );

    this.svg.append('text')
      .style('font-size', '0.6rem')
      .style('font-weight', 'normal')
      .attr('text-anchor', 'end')
      .attr('dy', -15)
      .text(() => {
        if (max <= 1000) {
          return 'R$';
        }
        if (max <= 900000) {
          return 'R$ mil';
        }
        return 'R$ milhões';
      });
  }

  plotBars(): void {
    const setTipContent = this.setTipContent;
    const onMouseOver = this.onMouseOverLegend;
    const onMouseOut = this.onMouseOutLegend;

    const stackedData = d3.stack()
      .keys(this.subgroups)
      (this.donations);

    this.svg.append('g')
      .selectAll('g')
      .data(stackedData)
      .join('g')
      .attr('fill', d => this.getColor(d.key))
      .attr('class', d => 'myRect ' + d.key )
      .selectAll('rect')
      .data(d => d)
      .join('rect')
      .attr('x', d => this.x(d.data.group))
      .attr('y', d => this.y(d[1]))
      .attr('height', d => (this.y(d[0]) - this.y(d[1])) || 0 )
      .attr('width', this.x.bandwidth())
      .attr('stroke', '#475055')
      .attr('stroke-width', 0.5)
      .on('mouseover', function (event, d) {
        const subgroupName = (d3.select(this.parentNode).datum() as any).key;
        const subgroupValue = event.data[subgroupName];

        setTipContent(subgroupName, subgroupValue);
        onMouseOver(subgroupName);
      })
      .on('mouseleave', (event, d) => {
        onMouseOut();
      })
      .on('mouseover.tip', this.tipElectoralBond.show)
      .on('mouseout.tip', this.tipElectoralBond.hide);
  }

  onMouseOverLegend(subgroupName) {
    d3.selectAll('.myRect').style('opacity', 0.2);
    d3.selectAll('.legendItem').style('opacity', 0.2);
    d3.selectAll('.'+subgroupName).style('opacity', 1);
  }

  onMouseOutLegend() {
    d3.selectAll('.myRect').style('opacity',1);
    d3.selectAll('.legendItem').style('opacity', 1);
  }
}
