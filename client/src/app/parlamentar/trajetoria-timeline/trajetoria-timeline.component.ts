import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';

function toPascalCase(text) {
  return text.replace(
    /\w+/g,
    word => word[0].toUpperCase() + word.slice(1).toLowerCase());
}

function isNotEmpty(list) {
  return (list || []).length > 0;
}

function getYearDurationForPost(post) {
  if (post.toUpperCase() === 'SENADOR')
    return 8;
  return 4;
}

@Component({
  selector: 'app-trajetoria-timeline',
  templateUrl: './trajetoria-timeline.component.html',
  styleUrls: ['./trajetoria-timeline.component.scss']
})
export class TrajetoriaTimelineComponent implements OnChanges {

  readonly EVENTO_CANDIDATURA = 'candidatura';
  readonly EVENTO_FILIACAO = 'filiacao';
  readonly EVENTO_MANDATO = 'mandato';

  readonly semesterSize = 1.5;
  readonly yearSize = this.semesterSize * 2;

  @Input() trajetoria: any;
  temTrajetoria: boolean;

  eventosPontuais: any;
  listaMandatos: any;

  private static buildEmptyTimelineSpace(semestersSize) {
    return {type: 'empty', semestersDuration: semestersSize}
  }

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (
      typeof changes.trajetoria !== 'undefined' &&
      typeof changes.trajetoria.currentValue !== 'undefined'
    ) {
      this.temTrajetoria = isNotEmpty(this.trajetoria.affiliation_history) || isNotEmpty(this.trajetoria.election_history);
      this.buildTimeline();
      this.fillTimelineGaps();
      // todo -> adjust overlaping years
    }
  }

  buildTimeline() {
    this.eventosPontuais = (this.trajetoria.affiliation_history || [])
      .map(item => {
        const [year, month, day] = item.started_in.split('-');
        return {
          type: this.EVENTO_FILIACAO,
          party: item.party,
          fullDate: day + '/' + month + '/' + year,
          year: +year,
          semester: Math.floor((+month - 1)/6) + 1,
        }
      }).concat(
        (this.trajetoria.election_history || [])
          .filter(item => !item.elected)
          .map(item => ({
            type: this.EVENTO_CANDIDATURA,
            post: toPascalCase(item.post),
            year: item.year,
            semester: 1,
          })
        )
      ).sort((a, b) => {
        let condition = a.year > b.year;
        if (a.year === b.year) {
          if (a.semester === b.semester && (a.fullDate || b.fullDate)) {
            if (!a.fullDate && b.fullDate) return -1;
            if (a.fullDate && !b.fullDate) return 1;
            const [aDay, aMonth, aYear] = a.fullDate.split('/');
            const [bDay, bMonth, bYear] = b.fullDate.split('/');
            if(aMonth === bMonth) condition = aDay > bDay;
            else condition = aMonth > bMonth;
          }
          else condition = a.semester > b.semester;
        }
        return condition ? -1 : 1;
      });

    this.listaMandatos = (this.trajetoria.election_history || [])
      .filter(item => item.elected)
      .map(item => {
        const mandatoDuration = getYearDurationForPost(item.post);
        const currentYear = new Date().getFullYear();
        const yearsFromNow = currentYear - item.year < 1 ? 1: currentYear - item.year;
        const yearsDuration = Math.min(mandatoDuration, yearsFromNow);
        return {
          type: this.EVENTO_MANDATO,
          post: toPascalCase(item.post),
          startYear: item.year + 1,
          endYear: item.year + yearsDuration,
          projectedEndYear: item.year + mandatoDuration,
          yearsDuration,
          color: this.getPostColor(item.post),
        }
      }).sort((a, b) => a.startYear > b.startYear ? -1 : 1);
  }

  calculateTimelineBoundaries() {
    let mostRecentYear = new Date().getFullYear();
    if(this.eventosPontuais[0] && this.eventosPontuais[0].year > mostRecentYear) {
      mostRecentYear = this.eventosPontuais[0].year;
    }
    if(this.listaMandatos[0] && this.listaMandatos[0].startYear > mostRecentYear) {
      mostRecentYear = this.listaMandatos[0].startYear;
    }

    let lastYear = mostRecentYear;
    const lastElement = (arr) => arr.slice(-1)[0];
    if(lastElement(this.eventosPontuais) && lastElement(this.eventosPontuais).year < lastYear) {
      lastYear = lastElement(this.eventosPontuais).year;
    }
    if(lastElement(this.listaMandatos) && lastElement(this.listaMandatos).startYear < lastYear) {
      lastYear = lastElement(this.listaMandatos).startYear;
    }

    return [mostRecentYear, lastYear]
  }

  fillTimelineGaps() {
    const [mostRecentYear, lastYear] = this.calculateTimelineBoundaries();
    const newEmptySpace = TrajetoriaTimelineComponent.buildEmptyTimelineSpace;
    const calcSemestersBetween = (startingYear, endingYear, startingSemester=null, endingSemester=null) => {
      if (startingYear === endingYear) return 0;
      const yearsDifference = endingYear - startingYear - 1;
      const semestersDifference = startingSemester && endingSemester ? endingSemester - startingSemester + 1 : 0;
      return yearsDifference * 2 + semestersDifference;
    };

    const filledEventsTimeline = [];
    this.eventosPontuais.forEach((currentEvent, index, allEvents) => {
      const nextEvent = allEvents[index + 1];
      let semestersDiff = 0;
      if (index === 0) {
        semestersDiff = calcSemestersBetween(
          currentEvent.year, mostRecentYear + 1,
          currentEvent.semester, 1,
        );
        filledEventsTimeline.push(newEmptySpace(semestersDiff));
      }
      filledEventsTimeline.push(currentEvent);
      if (nextEvent) {
        semestersDiff = calcSemestersBetween(
          nextEvent.year, currentEvent.year,
          nextEvent.semester, currentEvent.semester,
        );
      } else {
        semestersDiff = calcSemestersBetween(
          lastYear, currentEvent.year,
          1, currentEvent.semester,
        );
      }
      filledEventsTimeline.push(newEmptySpace(semestersDiff + 1));
    });
    this.eventosPontuais = filledEventsTimeline;

    const filledMandatosTimeline = [];
    this.listaMandatos.forEach((currentEvent, index, allEvents) => {
      const nextEvent = allEvents[index + 1];
      let semestersDiff = 0;
      if (index === 0) {
        semestersDiff = calcSemestersBetween(currentEvent.endYear, mostRecentYear + 1);
        filledMandatosTimeline.push(newEmptySpace(semestersDiff));
      }
      filledMandatosTimeline.push(currentEvent);
      if (nextEvent) {
        semestersDiff = calcSemestersBetween(nextEvent.endYear, currentEvent.startYear);
        filledMandatosTimeline.push(newEmptySpace(semestersDiff));
      }
    });
    this.listaMandatos = filledMandatosTimeline;
  }

  private getPostColor(post) {
    switch (post) {
      // Legislativo
      case 'SENADOR':
        return '#800080';
      case '1O SUPLENTE':
        return '#8e1c8e';
      case '2O SUPLENTE':
        return '#9c389c';
      case 'DEPUTADO FEDERAL':
        return '#89448d';
      case 'DEPUTADO ESTADUAL':
        return '#7c58ac';
      case 'DEPUTADO DISTRITAL':
        return '#a35ea3';
      case 'VEREADOR':
        return '#aa55aa';
      // Executivo
      case 'PRESIDENTE':
        return '#006400';
      case 'VICE-PRESIDENTE':
        return '#1c751c';
      case 'GOVERNADOR':
        return '#388638';
      case 'VICE-GOVERNADOR':
        return '#559755';
      case 'PREFEITO':
        return '#569760';
      case 'VICE-PREFEITO':
        return '#71a871';
    }
  }
}
