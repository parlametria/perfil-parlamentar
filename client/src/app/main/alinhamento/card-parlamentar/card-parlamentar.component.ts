import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';

import { Parlamentar } from 'src/app/shared/models/parlamentar.model';

@Component({
  selector: 'app-card-parlamentar',
  templateUrl: './card-parlamentar.component.html',
  styleUrls: ['./card-parlamentar.component.scss']
})
export class CardParlamentarComponent implements OnChanges, OnInit{

  @Input() id: number
  @Input() parlamentar: Parlamentar
  @Input() tema: number
  @Output() followChecked = new EventEmitter<boolean>();

  readonly FILTRO_PADRAO_TEMA = -1;

  alinhamento: any;

  following: boolean = false;

  constructor() {}

  ngOnInit() {    
    if(this.tema === null) {
      this.setAlinhamento(this.FILTRO_PADRAO_TEMA);
    }
  }
  
  ngOnChanges(changes: SimpleChanges) {     
    if (changes.tema !== undefined && changes.tema.currentValue !== null) {      
      this.setAlinhamento(changes.tema.currentValue);
    }    
  }

  toggleFollow() {
    this.following = !this.following;
    this.followChecked.emit(this.following);
  }

  setAlinhamento(tema: number) {    
    if (tema !== undefined && tema !== this.FILTRO_PADRAO_TEMA) {      
      this.alinhamento = this.parlamentar.alinhamento.temas.filter(res => res.tema_id === tema)[0];      
    } else {
      this.alinhamento = this.parlamentar.alinhamento;
    }
  }

}
