import { Component, OnChanges, AfterContentInit, Input, SimpleChanges } from '@angular/core';

import * as d3 from "d3";

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
      .range(['#8c510a','#d8b365','#f6e8c3','#f5f5f5','#c7eae5','#5ab4ac','#01665e'])
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
      for (let i = 0; i < camara.length; i++) {
        const [p1, p2, p3] = [
          [inicioArco + (distanciaFilas * i), alturaArco],
          [fimArco - (distanciaFilas * i), alturaArco],
          [angulo + (distanciaFilas * i), alturaArco - 100]];
        const [rad, flag1, flag2] = this.arcviaslope([p1[0], p1[1]], [p2[0], p2[1]], [p3[0], p3[1]]);

        const
          arc = this.g.append("path")
            .datum(camara[i])
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
    // let cadeiras = 58;
    // let distanciaCadeiras = 3;
    // let total = 0;
    // const camara = new Array();
    // for (let i = 0; i < 12; i++) {
    //   camara.push(Array.from(Array(cadeiras), x => -1))
    //   total = total + cadeiras;
    //   cadeiras = cadeiras - distanciaCadeiras;
    // }
    // camara.push(Array.from(Array(parlamentares.length - total), x => -1));
    const camara = new Array();
    camara.push(Array.from(Array(60), x => -1));
    camara.push(Array.from(Array(57), x => -1));
    camara.push(Array.from(Array(53), x => -1));
    camara.push(Array.from(Array(50), x => -1));
    camara.push(Array.from(Array(46), x => -1));
    camara.push(Array.from(Array(43), x => -1));
    camara.push(Array.from(Array(39), x => -1));
    camara.push(Array.from(Array(36), x => -1));
    camara.push(Array.from(Array(33), x => -1));
    camara.push(Array.from(Array(29), x => -1));
    camara.push(Array.from(Array(26), x => -1));
    camara.push(Array.from(Array(22), x => -1));
    camara.push(Array.from(Array(19), x => -1));

    for (let i = 0; i < 60; i++) {
      for (let j = 0; j < 60; j++) {
        if (typeof camara[j] !== 'undefined') {
          if (typeof camara[j][i] !== 'undefined') {
            camara[j][i] = parlamentares.shift();
          }
        }
      }
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
