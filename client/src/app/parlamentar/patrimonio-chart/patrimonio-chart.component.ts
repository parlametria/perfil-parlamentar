import { Component, AfterContentInit, OnChanges, SimpleChanges, Input, ViewEncapsulation } from '@angular/core';

import * as d3 from 'd3';
import d3Tip from 'd3-tip';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-patrimonio-chart',
  template: '<div id="patrimonio-chart"></div> <div id="chart-legend"></div>',
  styleUrls: ['./patrimonio-chart.component.scss']
})
export class PatrimonioChartComponent implements AfterContentInit, OnChanges {

  @Input() patrimonio: any;
  @Input() medianaPatrimonio: any;

  formattedAssetsData: any;

  width: number;
  height: number;
  totalWidth: number;
  totalHeight: number;
  margin: any;

  labelCanvas: any;
  svg: any;
  g: any;
  x: any;
  y: any;
  xAxis: any;
  yAxis: any;
  lines: any;
  points: any;
  numberFormat: any;
  currencyFormat: any;
  dateFormat: any;
  parseDate: any;

  tipPatrimonio: any;

  constructor() { }

  ngAfterContentInit(): void {
    const container: any = d3.select('.patrimonio-chart-wrapper').node();

    this.width = (container.offsetWidth < 580) ? 300 : 600;
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
    this.initTooltip();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      typeof changes.patrimonio !== 'undefined' &&
      typeof changes.patrimonio.currentValue !== 'undefined'
    ) {
      this.formattedAssetsData = this.groupPatrimonioData();
      this.drawVis();
    }
  }

  private groupPatrimonioData() {
    const minYear = +d3.min(this.patrimonio, (d: any) => d.year);
    const maxYear = +d3.max(this.patrimonio, (d: any) => d.year);
    return [
      {
        name: 'Patrimônio do parlamentar',
        values: this.patrimonio,
        color: '#5a44a0',
        visible: true,
      },
      {
        name: 'Mediana do patrimônio de todos os parlamentares',
        values: this.medianaPatrimonio.filter((d) => d.year >= minYear && d.year <= maxYear),
        color: '#43A467',
        visible: true,
      },
    ]
  }

  initChart() {
    this.svg = d3
      .select('#patrimonio-chart')
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

    this.labelCanvas = d3.select('#chart-legend')
      .append('svg')
      .attr('version', '1.1')
      .attr('xmlns:svg', 'http://www.w3.org/2000/svg')
      .attr('xmlns', 'http://www.w3.org/2000/svg')
      .attr('viewBox', '0 0 ' + this.totalWidth + ' ' + this.totalHeight)
      .append('g')
      .attr(
        'transform',
        'translate(' + this.margin.left + ', 0)'
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

    const locale = d3.formatLocale({
      decimal: ',',
      thousands: '.',
      grouping: [3],
      currency: ['R$ ', ' ']
    });

    this.numberFormat = d3.format('.2f');
    this.currencyFormat = locale.format('$,.2f');
    this.dateFormat = d3.timeFormat('%d/%m/%Y');
    this.parseDate = d3.timeParse('%Y-%m-%d');
  }

  private initTooltip() {
    this.tipPatrimonio = d3Tip()
      .attr('class', 'tip-patrimonio')
      .attr('id', 'tooltip-patrimonio')
      .offset([-10, 0])
      .html((d: any) => this.currencyFormat(d.value));
  }

  drawVis() {
    this.svg.call(this.tipPatrimonio);

    this.plotAxisX();
    this.plotAxisY();

    this.plotPatrimonio();
    this.addLegend();
  }

  private plotAxisX() {
    const minDate = new Date(+d3.min(this.patrimonio, (d: any) => d.year) -1, 0, 1);
    const maxDate = new Date(+d3.max(this.patrimonio, (d: any) => d.year), 11, 30);
    this.x.domain([minDate, maxDate]);

    this.g.append('g')
      .attr('class', 'axis-patrimonio axis--x')
      .call(this.xAxis)
      .call(g => g.select('.domain').style('stroke', 'transparent'))
      .call(g => g.selectAll('.tick text')
        .attr('dy', 15)
        .attr('opacity', 0.9)
        .style('font-size', '0.95em'))
      .call(g => g.selectAll('.tick')
        .attr('class', (d) => {
          for (const asset of this.patrimonio) {
            if (d.getFullYear() === asset.year) return 'tick normal'
          }
          return 'tick opaque';
        }));
    this.drawArrowOnAxisX();
  }

  private plotAxisY() {

    const maxPatrimonio = d3.max(this.patrimonio, (d: any) => +d.value);
    const maxMedianaPatrimonio = d3.max(this.medianaPatrimonio, (d: any) => +d.value);
    const maxValue = d3.max([maxPatrimonio, maxMedianaPatrimonio]);
    let max = maxValue;
    if (max < 900000) {
      max = 900000;
    } else if (max < 1000000) {
      max = 1000000;
    } else {
      max = Math.ceil(max / 10000000) * 10000000;
    }

    this.y.domain([0, maxValue]).nice();
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
      .attr('class', 'axis-patrimonio axis--y')
      .call(this.yAxis)
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick text')
        .attr('text-anchor', 'end')
        .attr('dx', -this.width - 15)
        .attr('opacity', 0.9)
        .style('font-size', '0.95em'));

    this.g.append('text')
      .style('font-size', '0.60em')
      .style('font-weight', 'normal')
      .attr('text-anchor', 'end')
      .attr('dx', -10)
      .attr('dy', -15)
      .text(() => {
        if (max <= 900000) {
          return 'R$ mil';
        }
        return 'R$ milhões';
      });
  }

  private drawArrowOnAxisX() {
    this.svg.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('refX', 1)
      .attr('refY', 4.5)
      .attr('markerWidth', 15)
      .attr('markerHeight', 10)
      .attr('orient', '0')
      .append('path')
      .attr('d', 'M 0 0 L 5 5 L 0 10')
      .attr('fill', '#595959');
    this.g
      .select('.axis--x path.domain')
      .attr('marker-end', 'url(#arrowhead)');
  }

  private plotPatrimonio() {
    const line = d3.line()
      .x((d: any) => this.x(new Date(d.year, 0, 1)))
      .y((d: any) => this.y(d.value));

    // removes the existing draw to create a new one
    if (this.lines) this.lines.style('display', 'none');
    if (this.lines) this.points.style('display', 'none');

    // Add the lines
    this.lines = this.g
      .selectAll('myLines')
      .data(this.formattedAssetsData)
      .enter()
      .append('path')
      .attr('class', (d) => d.name + 'patrimonio-data')
      .attr('d', (d) => line(d.values))
      .attr('stroke', (d) => d.color)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .style('stroke-width', 3)
      .style('fill', 'none')
      .style('visibility', (d) => {
        if (d.visible) {
          return 'visible';
        }
        return 'hidden';
      });

    // Add the points
    this.points = this.g
      .selectAll('myDots')
      .data(this.formattedAssetsData)
      .enter()
      .append('g')
      .style('fill', (d) => d.color)
      .attr('class', (d) => d.name + 'patrimonio-data')
      .style('visibility', (d) => {
        if (d.visible) {
          return 'visible';
        }
        return 'hidden';
      })
      .selectAll('myPoints')
      .data((d) => d.values)
      .enter()
      .append('circle')
      .attr('cx', (d) => {
        const date = new Date(d.year, 0, 1);
        return this.x(date);
      })
      .attr('cy', (d) => this.y(d.value) )
      .attr('r', 5)
      .attr('stroke', 'white')
      .on('mouseover.tip', this.tipPatrimonio.show)
      .on('mouseout.tip', this.tipPatrimonio.hide);
  }

  private addLegend() {
    const pickColor = (d: any) => {
      if (d.visible) {
        return d.color;
      }
      return '#adb5bd';
    };

    const onClickLegend = (d: any) => {
      this.formattedAssetsData = this.formattedAssetsData.map(data => {
        if (data.name === d.name) {
          data.visible = !d.visible;
        }
        return data
      });
      this.plotPatrimonio();
      d3.selectAll('.patrimonio-legend').transition().style('fill', pickColor)
    };

    // draw the circles
    this.labelCanvas
      .selectAll('myLegend')
      .data(this.formattedAssetsData)
      .enter()
      .append('circle')
      .attr('class', 'patrimonio-legend')
      .attr('cx',-15)
      .attr('cy',(d,i) => 10 + 15 * i)
      .attr('r', 3)
      .style('fill', pickColor)
      .on('click', onClickLegend);
    // draw the line name
    this.labelCanvas
      .selectAll('myLegend')
      .data(this.formattedAssetsData)
      .enter()
      .append('g')
      .append('text')
      .attr('class', 'patrimonio-legend')
      .attr('alignment-baseline','middle')
      .attr('x', -5)
      .attr('y', (d,i) => 10 + 15 * i)
      .text((d: any) => d.name)
      .style('fill', pickColor)
      .style('font-size', '0.55em')
      .on('click', onClickLegend);
  }
}
