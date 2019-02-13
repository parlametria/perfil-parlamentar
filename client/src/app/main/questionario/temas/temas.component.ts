import { Component, OnInit } from '@angular/core';
import { TemaService } from 'src/app/shared/services/tema.service';

@Component({
  selector: 'app-temas',
  templateUrl: './temas.component.html',
  styleUrls: ['./temas.component.scss']
})
export class TemasComponent implements OnInit {

  temas: any[];
  selectedTemas: any[] = [];
  hasAnySelectedTema : boolean = false;

  constructor(private temaService: TemaService) { }

  ngOnInit() {
    this.getTemas();
  }

  getTemas() {
    this.temaService.getTemas().subscribe((temas) => {
      this.temas = temas.data;
    });
  }

  clickButton(idTema) {
    if(!this.isTemaSelected(idTema)) {
      this.hasAnySelectedTema = true;
      this.selectedTemas.push(idTema);
    } else {
      this.selectedTemas.splice(this.selectedTemas.indexOf(idTema), 1);
      if(this.selectedTemas.length === 0) {
        this.hasAnySelectedTema = false;
      }
    }
  }

  isTemaSelected(idTema) {
    return(this.selectedTemas.includes(idTema));
  }

  emitTemas(){
    
  }
}
