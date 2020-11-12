import { Component, AfterContentInit, OnChanges, SimpleChanges, Input, ViewEncapsulation } from '@angular/core';

import * as d3 from 'd3';
import d3Tip from 'd3-tip';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-trajetoria-chart',
  template: '<div id="trajetoria-chart"></div>',
  styleUrls: ['./trajetoria-chart.component.scss']
})
export class TrajetoriaChartComponent implements AfterContentInit, OnChanges {

  @Input() trajetoria: any;

  assets: any;
  affillitions: any;
  elections: any;

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
  escalaCores: any;
  numberFormat: any;
  currencyFormat: any;
  dateFormat: any;
  parseDate: any;

  tipPatrimonio: any;
  tipFiliacao: any;
  tipMandato: any;

  constructor() { }

  ngAfterContentInit(): void {
    const container: any = d3.select('.trajetoria-chart-wrapper').node();

    this.width = (container.offsetWidth < 580) ? 300 : 600;
    this.height = 280;
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

    this.x = d3.scaleTime().range([0, this.width + 10]);
    this.y = d3.scaleLinear().range([this.height, 10]);
    this.xAxis = d3.axisTop(this.x)
      .tickFormat(d3.timeFormat('%Y'))
      .tickSize(0)
      .ticks(d3.timeYear);
    this.yAxis = d3
      .axisRight(this.y)
      .tickSize(this.width);

    this.line = d3.line()
      .x((d: any) => this.x(new Date(d.year, 0, 1)))
      .y((d: any) => this.y(d.value));

    this.escalaCores = d3.scaleOrdinal([
      "#FFFCBB",
      "#FFC69F",
      "#CCA9DD",
      "#C8F4FF",
      "#FFBBBB"
    ])
      
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
      .attr('class', 'tip-trajetoria')
      .attr('id', 'tooltip-patrimonio')
      .offset([-10, 0])
      .html((d: any) => this.currencyFormat(d.value));
    this.tipFiliacao = d3Tip()
      .attr('class', 'tip-trajetoria')
      .attr('id', 'tooltip-filiacao')
      .offset([-10, 0])
      .html((d: any) => d.party + ":" + this.dateFormat(this.parseDate(d.started_in)));
    this.tipMandato = d3Tip()
      .attr('class', 'tip-trajetoria')
      .attr('id', 'tooltip-mandato')
      .offset([-10, 0])
      .html((d: any) => {
        if (d.post === 'SENADOR') {
          return d.post + ': ' + (d.year + 1) + '- ' + (d.year + 7);
        } else {
          return d.post + ': ' + (d.year + 1) + '-' + (d.year + 4);
        }
      });
  }

  drawVis(trajetoria) {
    this.assets = this.trajetoria.asset_history
    this.affillitions = this.trajetoria.affiliation_history
    this.elections = this.trajetoria.election_history

    this.svg.call(this.tipPatrimonio);
    this.svg.call(this.tipFiliacao);
    this.svg.call(this.tipMandato);

    const earliestYear = d3.min(this.assets, (d: any) => d.year);
    let max = d3.max(this.assets, (d: any) => +d.value);
    if (max < 900000) {
      max = 900000;
    } else if (max < 1000000) {
      max = 1000000;
    } else {
      max = Math.ceil(max / 10000000) * 10000000;
    }

    let maxDate = new Date(2018, 11, 30);
    let minDate = new Date(
      d3.min(this.affillitions, (d: any) => {
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
    this.y.domain([0, d3.max(this.assets, (d: any) => d.value)]).nice();
    this.escalaCores.domain([1, 80])

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

    
    /**
     * Filiações
     */
    this.g.selectAll('.affil-point')
      .data(this.affillitions)
      .enter()
      .append('rect')
      .attr('class', 'affil-point')
      .attr('width', (d: any, i: number) => {
        const inicio = this.x(Date.parse(this.affillitions[i].started_in));
        let fim;
        if (i === this.affillitions.length - 1) {
          fim = this.x(maxDate);
        } else {
          fim = this.x(Date.parse(this.affillitions[i + 1].started_in));
        }

        return fim - inicio;
      })
      .attr('height', this.y(this.height))
      .attr("fill", (d: any, i: number) => { return this.escalaCores(i) })
      .attr('x', (d) => this.x(this.parseDate(d.started_in)))
      .on('mouseover.tip', this.tipFiliacao.show)
      .on('mouseout.tip', this.tipFiliacao.hide);

    /**
     * Filiações FIM
     */

     /**
     * Mandatos
     */
    this.g.selectAll('.elect-point')
      .data(this.elections)
      .enter()
      .append('rect')
      .attr('class', 'elect-point')
      .attr('width', (d) => {
        const start = this.x(new Date(d.year + 1, 0, 1));
        let end;
        if (d.post === 'SENADOR') {
          end = this.x(new Date(d.year + 8, 11, 30));
        } else {
          end = this.x(new Date(d.year + 4, 11, 30));
        }
        return end - start;
      })
      .attr('height', 5)
      .attr('x', (d) => this.x(new Date(d.year + 1, 0, 1)))
      .attr('y', this.height)
      .attr('fill', (d: any) => {
        if(d.elected) {
          return '#43a467'; 
        } else {
          return '#b54142';
        }
      })       
      .on('mouseover.tip', this.tipMandato.show)
      .on('mouseout.tip', this.tipMandato.hide);

      this.g.selectAll('.mandatos')
      .data(this.elections)
      .enter()
      .append('rect')
        .attr('x', (d: any) => this.x(new Date(d.year + 1, 0, 1)))
        .attr('y', 0)
        .attr('width', 0.4)
        .attr('height', this.height + 5)
        .attr('fill', '#353839"');

    /**
     * Mandatos FIM
     */

    /**
     * Patrimônio
     */

    this.g.append('g')
      .attr('class', 'axis-trajetoria axis--x')
      .call(this.xAxis)
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick text').attr('dy', 0))
      .call(g => g.selectAll('.tick')
        .attr('class', (d) => {
          if (maxDate.getFullYear() - minDate.getFullYear() <= 5) {
            return 'tick opaque';
          }
          const yearFrom1962 = d.getFullYear() - 1962;
          const divBy4 = (yearFrom1962 / 4).toString();
          if (divBy4.indexOf('.') === -1) {
            return 'tick normal';
          } else {
            return 'tick opaque';
          }
        }));
    this.g.append('g')
      .attr('class', 'axis-trajetoria axis--y')
      .call(this.yAxis)
      .call(g => g.select('.domain').remove())
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
        }))
      .call(g => g.select('.tick:last-of-type line')
        .attr('opacity', 0));

    this.g.append('path')
      .datum(this.assets)
      .attr('fill', 'none')
      .attr('stroke', '#5a44a0')
      .attr('stroke-width', 3)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('d', this.line);
    this.g.selectAll('circle')
      .data(this.assets)
      .enter()
      .append('circle')
      .attr('class', 'circle-patrimonio')
      .attr('fill', '#5a44a0')
      .attr('r', 5)
      .attr('cx', (d) => {
        const date = new Date(d.year, 0, 1);
        return this.x(date);
      })
      .attr('cy', (d) => this.y(d.value))
      .on('mouseover.tip', this.tipPatrimonio.show)
      .on('mouseout.tip', this.tipPatrimonio.hide);
    /**
     * Patrimônio FIM
     */
  }

}