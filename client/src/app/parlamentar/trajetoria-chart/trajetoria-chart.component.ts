import { Component, AfterContentInit, OnChanges, SimpleChanges, Input } from '@angular/core';

import * as d3 from 'd3';

@Component({
  selector: 'app-trajetoria-chart',
  template: '<div id="trajetoria-chart"></div>',
  styleUrls: ['./trajetoria-chart.component.scss']
})
export class TrajetoriaChartComponent implements AfterContentInit, OnChanges {

  @Input() trajetoria: any;

  width: number;
  height: number;
  totalWidth: number;
  totalHeight: number;
  margin: any;

  svg: any;
  g: any;
  x: any;
  y: any;
  xAxis: any;
  yAxis: any;
  line: any;
  numberFormat: any;

  constructor() { }

  ngAfterContentInit(): void {
    this.width = 400;
    this.height = 200;
    this.margin = {
      left: 65,
      right: 30,
      top: 30,
      bottom: 30
    };
    this.totalWidth = this.width + this.margin.left + this.margin.right;
    this.totalHeight = this.height + this.margin.top + this.margin.top;
    this.initChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      typeof changes.trajetoria !== 'undefined' &&
      typeof changes.trajetoria.currentValue !== 'undefined'
    ) {
      this.drawVis(this.trajetoria);
    }
  }

  initChart() {
    this.svg = d3
      .select('#trajetoria-chart')
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
      );

    this.x = d3.scaleTime().range([0, this.width]);
    this.y = d3.scaleLinear().range([this.height, 0]);
    this.xAxis = d3.axisBottom(this.x)
      .tickFormat(d3.timeFormat('%Y'))
      .tickSize(this.height)
      .ticks(d3.timeYear);
    this.yAxis = d3
      .axisRight(this.y)
      .tickSize(this.width);

    /* tslint:disable */
    this.line = d3.line()
      .x((d) => this.x(new Date(d.year, 0, 1)))
      .y((d) => this.y(d.value));
    /* tslint:enable */

    this.numberFormat = d3.format('.2f');
  }

  drawVis(trajetoria) {
    const earliestYear = +d3.min(trajetoria.asset_history, (d) => d.year);
    let max = d3.max(trajetoria.asset_history, (d) => +d.value);
    if (max < 900000) {
      max = 900000;
    } else if (max < 1000000) {
      max = 1000000;
    } else {
      max = Math.ceil(max / 10000000) * 10000000;
    }

    let maxDate = new Date(2018, 11, 30);
    let minDate = new Date(
      d3.min(trajetoria.affiliation_history, (d) => {
        const date = d3.timeParse('%Y-%M-%d')(d.started_in);
        return new Date(date.getFullYear(), 0, 1);
      })
    );
    if (minDate.getTime() === maxDate.getTime()) {
      minDate = new Date(maxDate.getFullYear() - 1, 0, 1);
    }
    if (earliestYear && earliestYear >= maxDate.getFullYear()) {
      minDate = new Date(earliestYear - 1, 0, 1);
      maxDate = new Date(earliestYear, 11, 30);
    }

    this.x.domain([minDate, maxDate]);
    this.y.domain([0, d3.max(trajetoria.asset_history, d => d.value)]).nice();

    this.yAxis.tickFormat((d) => {
      let s;
      if (max <= 900000) {
        s = d / 1000;
      } else {
        s = d / 1000000;
      }
      if (s.toString().length > 4) {
        s = this.numberFormat(s);
      }
      return '\xa0' + s;
    });

    this.g.append('g')
      .call(this.xAxis)
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick text').attr('dy', -this.height - 15));
    this.g.append('g')
      .call(this.yAxis)
      .call(g => g.selectAll('.tick text')
        .attr('text-anchor', 'end')
        .attr('dx', -this.width - 15))
      .call(g => g.select('.tick:last-of-type text')
        .text((d) => {
          let text = ' mil';
          if (max <= 900000) {
            text = ' mil';
          } else {
            text = ' milhões';
          }
          return 'R$' + text;
        }));

    this.g.append('path')
      .datum(trajetoria.asset_history)
      .attr('fill', 'none')
      .attr('stroke', '#5a44a0')
      .attr('stroke-width', 3)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('d', this.line);
    this.g.selectAll('circle')
      .data(trajetoria.asset_history)
      .enter()
      .append('circle')
      .attr('fill', '#5a44a0')
      .attr('r', 5)
      .attr('cx', (d) => {
        const date = new Date(d.year, 0, 1);
        return this.x(date);
      })
      .attr('cy', (d) => this.y(d.value));
  }

}
