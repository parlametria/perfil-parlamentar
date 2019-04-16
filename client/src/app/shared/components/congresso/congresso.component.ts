import { Component, OnChanges, AfterContentInit, Input, SimpleChanges } from '@angular/core';

import { Parlamentar } from '../../models/parlamentar.model';

import * as d3 from "d3";
import * as sl from "sainte-lague";

@Component({
  selector: 'app-congresso',
  template: '<div id="chart-parlamento" class="mb-4"></div>',
  styleUrls: ['./congresso.component.scss']
})
export class CongressoComponent implements AfterContentInit, OnChanges {
  @Input() parlamentares: any[];

  svg: any;
  g: any;
  color: any;
  width: number;
  height: number;
  margin: any;
  r: number;
  isReady: boolean;

  constructor() {
    this.isReady = false;
  }

  ngAfterContentInit() {
    this.width = 500;
    this.height = 250;
    this.margin = {
      left: 20,
      right: 20,
      top: 20,
      bottom: 20
    };
    this.r = 5;
    this.initChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      typeof changes.parlamentares !== "undefined" &&
      typeof changes.parlamentares.currentValue !== "undefined" &&
      changes.parlamentares.currentValue.length
    ) {
      const parlamentares = JSON.parse(JSON.stringify(changes.parlamentares.currentValue));
      this.draw(parlamentares);
    }
  }

  initChart() {
    this.svg = d3
      .select("#chart-parlamento")
      .append("svg")
      .attr("version", "1.1")
      .attr("xmlns:svg", "http://www.w3.org/2000/svg")
      .attr("xmlns", "http://www.w3.org/2000/svg")
      .attr("viewBox", "0 0 " + this.width + " " + this.height);

    this.g = this.svg
      .append("g")
      .attr(
        "transform",
        "translate(" + this.margin.left + "," + this.margin.top + ")"
      );
    this.color = d3
      .scaleThreshold<string, string>()
      .range(['#b2182b','#ef8a62','#fddbc7','#f7f7f7','#d1e5f0','#67a9cf','#2166ac'])
      .domain(["0.1", "0.2", "0.4", "0.6", "0.7", "0.8"]);
  }

  draw(parlamentares: any[]) {
    this.g.selectAll(".circle").remove();
      const inicioArco = 20;
      const fimArco = 440;
      const alturaArco = 200;
      const distanciaFilas = 12;
      const angulo = 20;

      const camara = this.getFilas(parlamentares);
      for (let i = 0; i < 13; i++) {
        const [p1, p2, p3] = [
          [inicioArco + (distanciaFilas * i), alturaArco],
          [fimArco - (distanciaFilas * i), alturaArco],
          [angulo + (distanciaFilas * i), alturaArco - 100]];
        const [rad, flag1, flag2] = this.arcviaslope([p1[0], p1[1]], [p2[0], p2[1]], [p3[0], p3[1]]);

        const
          arc = this.g.append("path")
            .attr("fill", "none")
            // .attr("stroke-width", "1.5px")
            // .attr("stroke", "black")
            .attr("d", rad && `M${p1[0]},${p1[1]} A${rad},${rad},0,${flag1},${flag2},${p2[0]},${p2[1]}`);

        const length = arc.node().getTotalLength();

        const x = d3.scaleLinear().domain([0, camara[i].length - 1]).range([0, length]);

        const circles = this.g.selectAll(".circle")
          .data(camara[i])
          .enter()
          .append("circle")
          .attr("r", this.r)
          .attr("fill", (d) => this.color(d.alinhamento.alinhamento))
          .attr("stroke", "none")
          .attr("cx", function(d, i) { return arc.node().getPointAtLength(x(i)).x; })
          .attr("cy", function(d, i) { return arc.node().getPointAtLength(x(i)).y; });
      }
  }

  getFilas(parlamentares: any[]) {
    const filas = [60, 57, 53, 50, 46, 43, 39, 36, 33, 29, 26, 22, 19];
    const camara = new Array();

    const grupos = d3.nest()
      .key((d: Parlamentar) => this.color(d.alinhamento.alinhamento))
      .entries(parlamentares);

    const distribuicao = grupos.map(g => g.values.length);

    for (let i = 0; i < filas.length; i++) {
      let g = sl(distribuicao, filas[i]);

      let fila = [];
      for (let j = 0; j < grupos.length; j++) {
        fila.push(...grupos[j].values.slice(0, g[j]));
      }
      camara.push(fila);

    }

    return camara;
  }

  // getFilas(parlamentares: any[]) {
  //   let camara = [];
  //   let cadeiras = 58;
  //   const distanciaCadeiras = 3;
  //   let total = parlamentares.length;
  //   while (total > 0) {
  //     let inicio = parlamentares.length - total;
  //     const fila = parlamentares.slice(inicio, cadeiras + inicio);
  //     camara.push(fila);
  //     total = total - cadeiras;
  //     cadeiras = cadeiras - distanciaCadeiras;
  //   }
  //   console.log(camara);
  //   return camara;
  // }

  // [pA1, pA2], [pB1, pB2], [pP1, pP2]
  arcviaslope([pA1, pA2], [pB1, pB2], [pP1, pP2]) {
    // vectors t from P -> A, v from A -> B
    const
      [t1, t2] = [pA1 - pP1, pA2 - pP2],
      [v1, v2] = [pB1 - pA1, pB2 - pA2];

    const
      tdotv = t1*v1 + t2*v2,
      twedgev = t1*v2 - t2*v1,
      tv_ctg = tdotv / twedgev,
      vv = v1*v1 + v2*v2;

    const radius = (1/2) * Math.sqrt(vv * (1 + tv_ctg*tv_ctg))
    const large_arc_flag = +(tdotv > 0);
    const sweep_flag = +(!(twedgev > 0)); //ab_cotangent > 1;

    return [radius, large_arc_flag, sweep_flag];
  }

}
