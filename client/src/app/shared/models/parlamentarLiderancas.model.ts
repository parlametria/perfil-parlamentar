interface CargoLideranca {
    cargo: string;
    blocoPartido: string;
}

export interface ParlamentarLiderancas {
  idParlamentarVoz: string;
  parlamentarLiderancas: CargoLideranca[];
}
