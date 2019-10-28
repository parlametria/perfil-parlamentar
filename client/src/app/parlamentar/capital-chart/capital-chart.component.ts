import { Component, AfterContentInit } from '@angular/core';

import * as d3 from 'd3';
import * as d3Sankey from 'd3-sankey';

@Component({
  selector: 'app-capital-chart',
  template: '<div id="capital-chart"></div>',
  styleUrls: ['./capital-chart.component.scss']
})
export class CapitalChartComponent implements AfterContentInit {

  svg: any;
  g: any;
  width: number;
  height: number;
  margin: any;

  constructor() { }

  ngAfterContentInit(): void {
    this.width = 500;
    this.height = 500;
    this.margin = {
      left: 10,
      right: 10,
      top: 10,
      bottom: 10
    };
    this.initChart();
    this.drawVis();
  }

  initChart() {
    this.svg = d3
      .select('#capital-chart')
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
  }

  drawVis() {
    const data = {
      nodes: [
        { name: 'Survived' },
        { name: 'Male' },
        { name: 'Female' }
      ],
      links: [
        { source: 0, target: 1, names: 'asd', value: 500 },
        { source: 0, target: 2, names: 'ghjgh', value: 500 }
      ]
    };


    const sankey = d3Sankey.sankey()
      .nodeWidth(15)
      .nodePadding(10)
      .size([this.width, this.height * 0.5]);

    sankey({
      nodes: data.nodes,
      links: data.links
    });

    const link = this.g
      .selectAll('.link')
      .data(data.links)
      .join('path')
        .attr('class', 'link')
        .attr('d', d3Sankey.sankeyLinkHorizontal())
        .attr('stroke', d => 'red')
        .attr('stroke-width', d => d.width)
        .style('mix-blend-mode', 'multiply');

    // this.svg.append('g')
    //   .attr('fill', 'none')
    //   .attr('stroke', '#000')
    //   .attr('stroke-opacity', 0.2)
    //   .selectAll('path')
    //   .data(sankey.links)
    //   .join('path')
    //   .attr('d', d3Sankey.sankeyLinkHorizontal())
    //   .attr('stroke-width', (d) => d.width);

  }

}
