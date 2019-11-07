import { Component, AfterContentInit, Input, OnChanges, SimpleChanges } from '@angular/core';

import * as d3 from 'd3';
import * as d3Sankey from 'd3-sankey';

import { ParlamentarInvestimento } from 'src/app/shared/models/parlamentarInvestimento.model';

@Component({
  selector: 'app-capital-chart',
  template: '<div id="capital-chart"></div>'
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
    this.width = 200;
    this.height = 200;
    this.margin = {
      left: 50,
      right: 50,
      top: 50,
      bottom: 50
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
        'translate(' + this.margin.left + ',' + this.margin.top + ')' +
        'rotate(90 ' + (this.width * 0.5) + ' ' + (this.height * 0.5) + ')'
      );

    this.format = d3.formatLocale({
      decimal: ',',
      thousands: '.',
      grouping: [3],
      currency: ['R$', ' ']
    });

    this.color = d3.scaleOrdinal()
      .domain(['Fundo do partido', 'Parlamentar', 'Outros'])
      .range(['#495057', '#7f3c8b', '#ccc']);
  }

  drawVis(parlamentar: ParlamentarInvestimento) {
    if (!parlamentar.partidoInvestimento.valor) { return; }
    const partido = parlamentar.partidoEleicao.sigla;
    const uf = parlamentar.parlamentarInvestimento.uf;
    const data = {
      nodes: [{
        id: 'total',
        name: 'Fundo do partido',
        perc: 1,
        desc: 'Gasto do ' + partido + '/' + uf }],
      links: []
    };

    data.nodes.push({
      id: 'outros',
      name: 'Outros',
      perc: (parlamentar.partidoInvestimento.valor - parlamentar.totalReceitaPartido) / parlamentar.partidoInvestimento.valor,
      desc: parlamentar.partidoInvestimento.numero_candidatos + ' outros'
    });
    data.links.push({
      source: 'total',
      target: 'outros',
      name: 'Outros',
      value: parlamentar.partidoInvestimento.valor - parlamentar.totalReceitaPartido
    });

    if (parlamentar.totalReceitaPartido > 0) {
      data.nodes.push({
        id: 'partido',
        name: 'Parlamentar',
        perc: parlamentar.totalReceitaPartido / parlamentar.partidoInvestimento.valor,
        desc: 'Parlamentar'
      });
      data.links.push({
        source: 'total',
        target: 'partido',
        name: 'Parlamentar',
        value: parlamentar.totalReceitaPartido
      });
    }

    const sankey = d3Sankey.sankey()
      .nodeWidth(10)
      .nodePadding(15)
      .size([this.width, this.height])
      .nodeId((d) => d.id);

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
      .attr('opacity', 0.5)
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
      .attr('style', 'font-size: 0.8rem')
      .attr('x', d => (d.x0 < this.width / 2) ? d.x1 - 24 : d.x0 + 24)
      .attr('y', d => (d.y1 + d.y0) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .text(d => this.format.format('.3s')(d.value).replace('M', ' M').replace('k', ' mil'))
      .attr('transform',
        d => 'rotate(-90 ' + ((d.x0 < this.width / 2) ? d.x1 - 24 : d.x0 + 24) + ' ' + ((d.y1 + d.y0) / 2) + ')');

    const text2 = this.g.append('g')
      .selectAll('text')
      .data(data.nodes)
      .join('text')
      .attr('style', 'font-size: 0.8rem')
      .attr('x', d => (d.x0 < this.width / 2) ? d.x1 - 40 : d.x0 + 40)
      .attr('y', d => (d.y1 + d.y0) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .text(d => d.desc)
      .attr('transform',
        d => 'rotate(-90 ' + ((d.x0 < this.width / 2) ? d.x1 - 40 : d.x0 + 40) + ' ' + ((d.y1 + d.y0) / 2) + ')');

    const text3 = this.g.append('g')
      .selectAll('text')
      .data(data.nodes)
      .join('text')
      .attr('style', 'font-size: 0.8rem')
      .attr('x', d => (d.x0 < this.width / 2) ? d.x1 + 10 : d.x0 - 10)
      .attr('y', d => (d.y1 + d.y0) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .text(d => this.format.format('.1%')(d.perc))
      .attr('opacity', d => (d.name === 'Fundo do partido') ? 0 : 1)
      .attr('transform',
        d => 'rotate(-90 ' + ((d.x0 < this.width / 2) ? d.x1 + 10 : d.x0 - 10) + ' ' + ((d.y1 + d.y0) / 2) + ')');
  }

}
