import {
  Component,
  Input,
  AfterContentInit,
  OnChanges,
  SimpleChanges
} from "@angular/core";

import * as d3 from "d3";

@Component({
  selector: "app-parlamento",
  template: '<div id="chart-parlamento" class="mb-4"></div>',
  styleUrls: ["./parlamento.component.scss"]
})
export class ParlamentoComponent implements AfterContentInit, OnChanges {
  @Input() parlamentares: any[];

  svg: any;
  g: any;
  width: number;
  height: number;
  margin: any;
  x: any;
  color: any;
  r: number;

  constructor() {}

  ngAfterContentInit() {
    this.width = 440;
    this.height = 240;
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
      this.draw(changes.parlamentares.currentValue);
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
    this.x = d3.scaleLinear().range([0, this.getWidth()]);
    // this.color = d3.scaleSequential(d3.interpolatePRGn);
    this.color = d3
      .scaleThreshold()
      .range(["#f2f0f7", "#cbc9e2", "#9e9ac8", "#756bb1", "#54278f"])
      .domain([0.2, 0.4, 0.6, 0.8]);

    this.g
      .append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0, " + this.getHeight() + ")")
      .call(d3.axisBottom(this.x).ticks(3, ".0%"));
  }

  draw(parlamentares: any[]) {
    this.g.selectAll(".circle").remove();

    parlamentares = parlamentares.filter(p => p.alinhamento.alinhamento > 0.1);

    let simulation = d3
      .forceSimulation(parlamentares)
      .force("x", d3.forceX(d => this.x(d.alinhamento.alinhamento)).strength(1))
      .force("y", d3.forceY(this.getHeight() * 0.5))
      .force("collide", d3.forceCollide(this.r + 0.5))
      .stop();

    for (var i = 0; i < 120; ++i) simulation.tick();

    let circles = this.g
      .selectAll(".circle")
      .data(parlamentares)
      .enter()
      .append("circle")
      .attr("class", "circle")
      .attr("r", this.r)
      .attr("fill", d => this.color(d.alinhamento.alinhamento))
      // .attr("stroke", "#000")
      // .attr("stroke-opacity", "0.2")
      // .attr("stroke-width", "1")
      .attr("cx", d => d.x)
      .attr("cy", this.getHeight() * 0.5);

    circles
      .transition()
      .duration(d => d.alinhamento.alinhamento * 1000)
      .delay(500)
      .attr("cy", d => d.y);
  }

  getWidth() {
    return this.width - this.margin.left - this.margin.right;
  }

  getHeight() {
    return this.height - this.margin.top - this.margin.bottom;
  }
}
