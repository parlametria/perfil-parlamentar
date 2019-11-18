import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-busca-parlamentar',
  templateUrl: './busca-parlamentar.component.html',
  styleUrls: ['./busca-parlamentar.component.scss']
})
export class BuscaParlamentarComponent implements OnInit {

  filtro: any;
  casa: string;

  constructor() { }

  ngOnInit() {
  }

  search(filter: any) {
    this.filtro = JSON.parse(JSON.stringify(filter));
    console.log(this.filtro);
  }
}
