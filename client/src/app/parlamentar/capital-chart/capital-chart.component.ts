import { Component, AfterContentInit, Input, OnChanges, SimpleChanges } from '@angular/core';

import * as d3 from 'd3';
import * as d3Sankey from 'd3-sankey';

import { ParlamentarInvestimento } from 'src/app/shared/models/parlamentarInvestimento.model';

@Component({
  selector: 'app-capital-chart',
  template: '<div id="capital-chart"></div>',
  styleUrls: ['./capital-chart.component.scss']
})
export class CapitalChartComponent implements AfterContentInit, OnChanges {

  @Input() parlamentar: ParlamentarInvestimento;

  svg: any;
  g: any;
  width: number;
  height: number;
  totalWidth: number;
  totalHeight: number;
  margin: any;
  format: any;
  color: any;

  constructor() { }

  ngAfterContentInit(): void {
    this.width = 300;
    this.height = 240;
    this.margin = {
      left: 20,
      right: 20,
      top: 20,
      bottom: 20
    };
    this.totalWidth = this.width + this.margin.left + this.margin.right;
    this.totalHeight = this.height + this.margin.top + this.margin.top;
    this.initChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      typeof changes.parlamentar !== 'undefined' &&
      typeof changes.parlamentar.currentValue !== 'undefined'
    ) {
      this.drawVis(this.parlamentar);
    }
  }

  initChart() {
    this.svg = d3
      .select('#capital-chart')
      .append('svg')
      .attr('version', '1.1')
      .attr('xmlns:svg', 'http://www.w3.org/2000/svg')
      .attr('xmlns', 'http://www.w3.org/2000/svg')
      .attr('viewBox', '0 0 ' + this.totalWidth + ' ' + this.totalHeight);

    this.g = this.svg
      .append('g')
      .attr(
        'transform',
        'translate(' + this.margin.left + ',' + this.margin.top + ')'
        // 'rotate(90 ' + (this.width * 0.5) + ' ' + (this.height * 0.5) + ')'
      );

    this.format = d3.formatLocale({
      decimal: ',',
      thousands: '.',
      grouping: [3],
      currency: ['R$', ' ']
    });

    this.color = d3.scaleOrdinal()
      .domain(['Total investido', 'Fundo partidário', 'Outros'])
      .range(['#7f3c8b', '#7f3c8b', '#aaa']);
  }

  drawVis(parlamentar: ParlamentarInvestimento) {
    if (!parlamentar.totalReceitaCandidato) { return; }
    const data = {
      nodes: [
        { name: 'Total investido' },
        { name: 'Fundo partidário' },
        { name: 'Outros' }
      ],
      links: [
        {
          source: 0,
          target: 1,
          name: 'Fundo partidário',
          value: parlamentar.totalReceitaPartido
        },
        {
          source: 0,
          target: 2,
          name: 'Outros',
          value: parlamentar.totalReceitaCandidato - parlamentar.totalReceitaPartido
        }
      ]
    };

    const sankey = d3Sankey.sankey()
      .nodeWidth(10)
      .nodePadding(15)
      .size([this.width, this.height]);

    sankey({
      nodes: data.nodes,
      links: data.links
    });

    const link = this.g.append('g')
      .selectAll('.link')
      .data(data.links)
      .join('path')
      .attr('class', 'link')
      .attr('d', d3Sankey.sankeyLinkHorizontal())
      .attr('stroke', d => this.color(d.name))
      .attr('stroke-width', d => d.width)
      .attr('opacity', 0.6)
      .style('mix-blend-mode', 'multiply');

    const node = this.g.append('g')
      .selectAll('rect')
      .data(data.nodes)
      .join('rect')
      .attr('fill', d => this.color(d.name))
      .attr('x', d => d.x0)
      .attr('y', d => d.y0)
      .attr('height', d => d.y1 - d.y0)
      .attr('width', d => d.x1 - d.x0)
      .append('title')
      .text(d => `${d.name}\n${d.value.toLocaleString()}`);

    const text = this.g.append('g')
      .selectAll('text')
      .data(data.nodes)
      .join('text')
      .attr('class', 'sankey-text')
      .attr('x', d => (d.x0 < this.width / 2) ? d.x1 + 10 : d.x0 - 10)
      .attr('y', d => (d.y1 + d.y0) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', d => d.x0 < this.width / 2 ? 'start' : 'end')
      .text(d => this.format.format(',.2f')(d.value));
  }

}
