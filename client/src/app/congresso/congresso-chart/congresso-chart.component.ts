import { Component, OnChanges, AfterContentInit, Input, SimpleChanges } from '@angular/core';

import * as d3 from 'd3';
import * as sl from 'sainte-lague';

import { Parlamentar } from '../../shared/models/parlamentar.model';

@Component({
  selector: 'app-congresso-chart',
  template: '<div id="chart-parlamento" class="mb-4"></div>',
  styleUrls: ['./congresso-chart.component.scss']
})
export class CongressoChartComponent implements AfterContentInit, OnChanges {
  @Input() parlamentares: any[];
  @Input() view: any;
  @Input() filter: any;

  svg: any;
  g: any;
  circles: any;
  axis: any;
  clusters: any;

  color: any;
  width: number;
  height: number;
  margin: any;
  r: number;
  length: number;

  constructor() {
    this.length = 0;
  }

  ngAfterContentInit() {
    this.width = 500;
    this.height = 600;
    this.margin = {
      left: 0,
      right: 20,
      top: 60,
      bottom: 20
    };
    this.r = 5.5;
    this.initChart();
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (
      typeof changes.parlamentares !== 'undefined' &&
      typeof changes.parlamentares.currentValue !== 'undefined' &&
      changes.parlamentares.currentValue.length
    ) {
      this.parlamentares = JSON.parse(JSON.stringify(changes.parlamentares.currentValue));

      if (this.parlamentares.length >= 513) {
        await this.draw();
        await this.paint();

        setTimeout(() => {
          if (this.view === 'lg') {
            this.showArc();
          } else if (this.view === 'md') {
            this.showClusters();
          } else {
            this.showBeeswarm();
          }
        }, 3000);

      } else {
        this.paint();
      }
    }
    if (
      typeof changes.view !== 'undefined' &&
      typeof changes.view.currentValue !== 'undefined' &&
      !changes.view.firstChange
    ) {
      if (changes.view.currentValue === 'lg') {
        this.showArc();
      } else if (changes.view.currentValue === 'md') {
        this.showClusters();
      } else {
        this.showBeeswarm();
      }
    }
  }

  initChart() {
    this.svg = d3
      .select('#chart-parlamento')
      .append('svg')
      .attr('version', '1.1')
      .attr('xmlns:svg', 'http://www.w3.org/2000/svg')
      .attr('xmlns', 'http://www.w3.org/2000/svg')
      .attr('viewBox', '0 0 ' + this.width + ' ' + this.height);

    this.g = this.svg
      .append('g')
      .attr(
        'transform',
        'translate(' + this.margin.left + ',' + this.margin.top + ')'
      );

    this.color = d3
      .scaleThreshold<string, string>()
      .domain(['0.0001', '0.3', '0.4', '0.5', '0.6', '0.7', '0.8'])
      .range(['#848484', '#b54142', '#cf7d79', '#e1b5b5', '#eceff4', '#a8c8dd', '#6ca0bf', '#3e7799']);

    this.axis = this.svg
      .append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0, ' + (this.height - this.margin.bottom) + ')');
  }

  getPath(d: any) {
    let temaIndex;
    temaIndex = this.parlamentares[0].alinhamento.temas.findIndex(res => res.tema_id === this.filter.tema);

    if (temaIndex !== undefined && temaIndex !== -1) {
      return this.getAlinhamento(d.alinhamento.temas[temaIndex]);
    } else {
      return this.getAlinhamento(d.alinhamento);
    }
  }

  getAlinhamento(alinhamento: any): number {
    if (alinhamento.perguntasIguais < 3) {
      return -1;
    } else {
      return alinhamento.alinhamento;
    }
  }

  draw() {
    this.g.selectAll('.circle-parlamentar').remove();
    this.g.selectAll('.clusters').remove();
    const inicioArco = 20;
    const fimArco = 480;
    const alturaArco = 190;
    const distanciaFilas = 12;
    const angulo = 18;

    const xBeeSwarm = d3.scaleLinear().range([this.width * 0.8, this.width * 0.2]);
    this.axis.call(d3.axisBottom(xBeeSwarm).ticks(7, '.0%'));

    const simulation = d3
      .forceSimulation(this.parlamentares)
      .force('x', d3.forceX((d: any) => xBeeSwarm(this.getPath(d))).strength(1))
      .force('y', d3.forceY(this.height * 0.2))
      .force('collide', d3.forceCollide(this.r + 1))
      .stop();
    for (let i = 0; i < 120; ++i) {
      simulation.tick();
    }

    const group = d3.nest()
      .key((d: Parlamentar) => d.partido)
      .entries(this.parlamentares);
    const children = {
      children: group.map(g => {
        return {
          children: g.values
        };
      })
    };

    const clusters = d3.pack()
      .size([this.width, this.height * 0.8])
      .padding(0)(d3.hierarchy(children).sum(d => 1));

    const leaves = clusters.leaves();
    leaves.map(l => {
      const s = 'idParlamentarVoz';
      const i = this.parlamentares.findIndex(p => p.idParlamentarVoz === l.data[s]);
      this.parlamentares[i].clusterX = l.x;
      this.parlamentares[i].clusterY = l.y;
    });

    this.svg.selectAll('.clusters')
      .attr('opacity', 0);

    this.clusters = this.svg.append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')')
      .attr('fill', 'none')
      .attr('stroke-width', 'none')
      .attr('stroke', '#ccc')
      .attr('class', 'clusters')
      .selectAll('circle')
      .data(clusters.descendants().filter(d => d.height === 1))
      .join('circle')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', d => d.r)
      .attr('opacity', 0);

    const camara = this.getFilas(this.parlamentares);
    for (let i = 0; i < 13; i++) {
      const [p1, p2, p3] = [
        [inicioArco + (distanciaFilas * i), alturaArco],
        [fimArco - (distanciaFilas * i), alturaArco],
        [angulo + (distanciaFilas * i), alturaArco - 100]];
      const [rad, flag1, flag2] = this.arcviaslope([p1[0], p1[1]], [p2[0], p2[1]], [p3[0], p3[1]]);

      const
        arc = this.g.append('path')
          .attr('fill', 'none')
          .attr('d', rad && `M${p1[0]},${p1[1]} A${rad},${rad},0,${flag1},${flag2},${p2[0]},${p2[1]}`);

      const length = arc.node().getTotalLength();

      const xArc = d3.scaleLinear().domain([0, camara[i].length - 1]).range([0, length]);

      this.circles = this.g.selectAll()
        .data(camara[i])
        .enter()
        .append('circle')
        .attr('id', (d) => 'circle-parlamentar-' + d.idParlamentarVoz)
        .attr('class', 'circle-parlamentar')
        .attr('r', this.r)
        .attr('fill', 'white')
        .attr('stroke', 'none')
        .attr('cx', (d, z) => {
          d.arcX = arc.node().getPointAtLength(xArc(z)).x;
          return d.arcX;
        })
        .attr('cy', (d, w) => {
          d.arcY = arc.node().getPointAtLength(xArc(w)).y;
          return d.arcY;
        })
        .attr('opacity', 1)
        .on('mouseover', (d) => console.log(d));

    }
  }

  paint() {
    this.g.selectAll('.circle-parlamentar')
      .transition()
      .duration((d, i) => i * 5)
      .delay(500)
      .attr('fill', (d) => this.color(this.getPath(d)))
      .attr('opacity', d => this.parlamentares.filter(parlamentar =>
        d.idParlamentarVoz === parlamentar.idParlamentarVoz).length > 0 ? 1 : 0.2);

    this.clusters
      .attr('opacity', 0);
  }

  showArc() {
    this.g.selectAll('.circle-parlamentar')
      .transition()
      .duration((d) => d.alinhamento.alinhamento * 1000 + 300)
      .delay(250)
      .attr('cx', d => d.arcX)
      .attr('cy', d => d.arcY)
      .attr('opacity', d => this.parlamentares.filter(parlamentar =>
        d.idParlamentarVoz === parlamentar.idParlamentarVoz).length > 0 ? 1 : 0.2);
    this.clusters
      .attr('opacity', 0);
  }

  showClusters() {
    this.g.selectAll('.circle-parlamentar')
      .transition()
      .ease(d3.easeCubicIn)
      .duration(250)
      .delay(250)
      .attr('cx', d => d.clusterX)
      .attr('cy', d => d.clusterY)
      .attr('opacity', d => this.parlamentares.filter(parlamentar =>
        d.idParlamentarVoz === parlamentar.idParlamentarVoz).length > 0 ? 1 : 0.2);

    this.clusters
      .transition()
      .delay(250)
      .attr('opacity', 1);
  }

  showBeeswarm() {
    this.g.selectAll('.circle-parlamentar')
      .transition()
      .duration((d) => d.alinhamento.alinhamento * 1000 + 300)
      .delay(250)
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('opacity', d => this.parlamentares.filter(parlamentar =>
        d.idParlamentarVoz === parlamentar.idParlamentarVoz).length > 0 ? 1 : 0.2);

    this.clusters
      .attr('opacity', 0);
  }



  getFilas(parlamentares: Parlamentar[]) {
    const filas = [60, 57, 53, 50, 46, 43, 39, 36, 32, 29, 25, 21, 22];
    const camara = new Array();

    const grupos = d3.nest()
      .key((d: Parlamentar) => this.color(d.alinhamento.alinhamento))
      .entries(parlamentares);

    const distribuicao = grupos.map(g => g.values.length);

    for (const f of filas) {
      const g = sl(distribuicao, f);

      const fila = [];
      for (let j = 0; j < grupos.length; j++) {
        fila.push(...grupos[j].values.splice(0, g[j]));
      }
      camara.push(fila);
    }

    return camara;
  }

  // [pA1, pA2], [pB1, pB2], [pP1, pP2]
  arcviaslope([pA1, pA2], [pB1, pB2], [pP1, pP2]) {
    // vectors t from P -> A, v from A -> B
    const [t1, t2] = [pA1 - pP1, pA2 - pP2];
    const [v1, v2] = [pB1 - pA1, pB2 - pA2];

    const tdotv = t1 * v1 + t2 * v2;
    const twedgev = t1 * v2 - t2 * v1;
    const tvCtg = tdotv / twedgev;
    const vv = v1 * v1 + v2 * v2;

    const radius = (1 / 2) * Math.sqrt(vv * (1 + tvCtg * tvCtg));
    const largeArcFlag = +(tdotv > 0);
    const sweepFlag = +(!(twedgev > 0)); // ab_cotangent > 1;

    return [radius, largeArcFlag, sweepFlag];
  }

}
