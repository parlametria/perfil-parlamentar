import { Component, OnChanges, AfterContentInit, Input, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import * as d3 from 'd3';
import d3Tip from 'd3-tip';
import * as hn from 'hare-niemeyer';

import { Parlamentar } from '../../shared/models/parlamentar.model';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-congresso-chart',
  template: '<div id="chart-parlamento" class="parlamento my-2"></div>',
  styleUrls: ['./congresso-chart.component.scss']
})
export class CongressoChartComponent implements AfterContentInit, OnChanges {
  @Input() parlamentares: any[];
  @Input() view: any;
  @Input() filter: any;

  drawn = false;
  temaAtual: number;

  svg: any;
  g: any;
  circles: any;
  axis: any;
  clusters: any;

  colorScheme: Array<string>;
  color: any;
  width: number;
  height: number;
  margin: any;
  r: number;
  length: number;

  tip: any;

  constructor(private router: Router) {
    this.length = 0;
    this.colorScheme = ['#eceff4', '#b54142', '#c17a66', '#c6ac8d', '#6B92A5', '#247FB5'];
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
    this.r = 5;
    this.initChart();
    this.initTooltip();
    this.temaAtual = this.filter.tema;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      typeof changes.parlamentares !== 'undefined' &&
      typeof changes.parlamentares.currentValue !== 'undefined' &&
      changes.parlamentares.currentValue.length
    ) {
      this.parlamentares = JSON.parse(JSON.stringify(changes.parlamentares.currentValue));
      if (this.svg) {

        if (this.filter.tema !== this.temaAtual) { // redesenhe a visualização se o tema do alinhamento for alterado
          this.temaAtual = this.filter.tema;
          this.drawn = false;
        }

        if (this.parlamentares.length > 0) { // Array de parlamentares maior que 0
          if (this.parlamentares.length === 513) {
            if (!this.drawn) { // Vis parlamento. Primeiro desenho.
              this.draw();
              this.paint();
              this.drawn = true;
            } else {
              this.showArc(); // Vis parlamento. Já desenhado uma vez.
            }
          } else {
            if (!this.drawn) { // Vis Beeswarm. Primeiro desenho.
              this.drawBeeSwarm();
              this.showBeeswarm();
            } else { // Vis Beeswarm. Já desenhado uma vez.
              this.paint();
              this.showBeeswarm();
            }
          }
        }
      }
    }
    // Controle de mudança de visualização
    // if (
    //   typeof changes.view !== 'undefined' &&
    //   typeof changes.view.currentValue !== 'undefined' &&
    //   !changes.view.firstChange
    // ) {
    //   if (changes.view.currentValue === 'lg') {
    //     this.showArc();
    //   } else if (changes.view.currentValue === 'md') {
    //     this.showClusters();
    //   } else {
    //     this.showBeeswarm();
    //   }
    // }
  }

  initChart() {
    this.svg = d3
      .select('#chart-parlamento')
      .append('svg')
      .attr('version', '1.1')
      .attr('xmlns:svg', 'http://www.w3.org/2000/svg')
      .attr('xmlns', 'http://www.w3.org/2000/svg')
      .attr('viewBox', '0 0 ' + this.width + ' ' + this.height / 2);

    this.g = this.svg
      .append('g')
      .attr(
        'transform',
        'translate(' + this.margin.left + ',' + this.margin.top + ')'
      );

    this.color = d3
      .scaleThreshold<string, string>()
      // .domain(['0', '0.3', '0.4', '0.5', '0.6', '0.7', '0.8'])
      // .range(['#848484', '#b54142', '#cf7d79', '#e1b5b5', '#eceff4', '#a8c8dd', '#6ca0bf', '#3e7799']);
      .domain(['0', '0.3', '0.5', '0.6', '0.8'])
      .range(this.colorScheme);

    this.axis = this.svg
      .append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0, ' + (this.height - this.margin.bottom) + ')');
  }

  private initTooltip() {
    this.tip = d3Tip()
      .attr('class', 'd3-tip')
      .attr('id', 'tooltip')
      .offset([-10, 0])
      .html((d: Parlamentar) => {
        return '<strong>' + this.titleCase(d.nomeEleitoral) + '</strong>' +
          ' <span class="subtitle">' + d.uf + '/' + d.partido + '</span>' + '<br>' +
          '<span>' + this.formatAlinhamento(this.getPath(d)) + '</span>';
      });
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

    this.svg.call(this.tip);

    const inicioArco = 20;
    const fimArco = 480;
    const alturaArco = 190;
    const distanciaFilas = 12;
    const angulo = 18;

    const xBeeSwarm = d3.scaleLinear().range([this.width * 0.8, this.width * 0.2]);

    const simulation = d3
      .forceSimulation(this.parlamentares)
      .force('x', d3.forceX((d: any) => xBeeSwarm(this.getPath(d))).strength(1))
      .force('y', d3.forceY(this.height * 0.1))
      .force('collide', d3.forceCollide(this.r + 1))
      .stop();

    for (let i = 0; i < 120; ++i) {
      simulation.tick();
    }

    // this.drawClusters();

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
        // .attr('stroke', '#515151')
        .attr('stroke', (d) => (this.color(this.getPath(d)) === '#eceff4') ? '#9B9B9B' : this.color(this.getPath(d)))
        .attr('cx', (d, z) => {
          d.arcX = arc.node().getPointAtLength(xArc(z)).x;
          return d.arcX;
        })
        .attr('cy', (d, w) => {
          d.arcY = arc.node().getPointAtLength(xArc(w)).y;
          return d.arcY;
        })
        .attr('opacity', 1)
        .on('mouseover.tip', this.tip.show)
        .on('mouseout.tip', this.tip.hide)
        .on('dblclick', (d) => {
          this.g.selectAll('circle-parlamentar').call(this.tip.hide); // apaga tooltips ativos
          this.router.navigate(['/parlamentar/' + d.idParlamentarVoz]);
        });

    }
  }

  paint() {
    this.g.selectAll('.circle-parlamentar')
      .transition()
      .duration((d, i) => i * 4)
      .attr('fill', (d) => this.color(this.getPath(d)))
      .attr('opacity', d => this.parlamentares.filter(parlamentar =>
        d.idParlamentarVoz === parlamentar.idParlamentarVoz).length > 0 ? 1 : 0.2);
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
      .attr('fill', (d) => this.color(this.getPath(d)))
      .attr('opacity', d => this.parlamentares.filter(parlamentar =>
        d.idParlamentarVoz === parlamentar.idParlamentarVoz).length > 0 ? 1 : 0.2);
  }

  drawClusters() {
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
  }

  drawBeeSwarm() {
    this.g.selectAll('.circle-parlamentar').remove();
    this.g.selectAll('.clusters').remove();

    this.svg.call(this.tip);

    const xBeeSwarm = d3.scaleLinear().range([this.width * 0.8, this.width * 0.2]);

    const simulation = d3
      .forceSimulation(this.parlamentares)
      .force('x', d3.forceX((d: any) => xBeeSwarm(this.getPath(d))).strength(1))
      .force('y', d3.forceY(this.height * 0.1))
      .force('collide', d3.forceCollide(this.r + 1))
      .stop();

    for (let i = 0; i < 120; ++i) {
      simulation.tick();
    }

    this.circles = this.g.selectAll()
      .data(this.parlamentares)
      .enter()
      .append('circle')
      .attr('id', (d) => 'circle-parlamentar-' + d.idParlamentarVoz)
      .attr('class', 'circle-parlamentar')
      .attr('r', this.r)
      .attr('fill', 'white')
      .attr('stroke', (d) => (this.color(this.getPath(d)) === '#eceff4') ? '#9B9B9B' : this.color(this.getPath(d)))
      .attr('opacity', 1)
      .on('mouseover.tip', this.tip.show)
      .on('mouseout.tip', this.tip.hide)
      .on('dblclick', (d) => {
        this.g.selectAll('circle-parlamentar').call(this.tip.hide); // apaga tooltips ativos
        this.router.navigate(['/parlamentar/' + d.idParlamentarVoz]);
      });

  }

  private getFilas(parlamentares: Parlamentar[]) {
    const filas = [60, 57, 53, 50, 46, 43, 39, 36, 33, 29, 25, 23, 19];
    const camara = new Array();

    const grupos = d3.nest()
      .key((d: Parlamentar) => this.color(this.getPath(d)))
      .entries(parlamentares);

    const colors = this.colorScheme.slice().reverse();

    grupos.sort((a, b) => {
      return colors.indexOf(a.key) - colors.indexOf(b.key);
    });

    const distribuicao = grupos.map(g => g.values.length);

    for (let f = 0; f < filas.length - 1; f++) {
      const g = hn(distribuicao, filas[f]);

      const fila = [];
      for (let j = 0; j < grupos.length; j++) {
        fila.push(...grupos[j].values.splice(0, g[j]));
      }
      camara.push(fila);
    }

    // Preenche a última fila com os elementos restantes
    const ultimaFila = [];

    for (const grupo of grupos) {
      const a = JSON.parse(JSON.stringify(grupos));
      ultimaFila.push(...grupo.values.splice(0, grupo.values.length));
    }
    camara.push(ultimaFila);

    return camara;
  }

  // [pA1, pA2], [pB1, pB2], [pP1, pP2]
  private arcviaslope([pA1, pA2], [pB1, pB2], [pP1, pP2]) {
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

  private titleCase(title: string): string {
    return title.toLowerCase().split(' ').map((word) => {
      return word.replace(word[0], word[0].toUpperCase());
    }).join(' ');
  }

  private formatAlinhamento(alinhamento: number): string {
    if (alinhamento === -1) {
      return '--';
    } else {
      return Math.round(alinhamento * 100) + '%';
    }
  }

}
