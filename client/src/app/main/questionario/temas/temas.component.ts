import { Component, OnInit } from '@angular/core';
import { TemaService } from 'src/app/shared/services/tema.service';

@Component({
  selector: 'app-temas',
  templateUrl: './temas.component.html',
  styleUrls: ['./temas.component.scss']
})
export class TemasComponent implements OnInit {

  temas: any[];
  temaSelected: any[] = [];
  hasAnyTemaSelected : boolean = false;

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
    if(!this.temaSelected.includes(idTema)) {
      this.hasAnyTemaSelected = true;
      this.temaSelected.push(idTema);
    }
  }
}
