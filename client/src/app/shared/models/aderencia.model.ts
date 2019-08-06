import { Partido } from './partido.model';
import { Tema } from './tema.model';

export interface AderenciaDados {
    faltou: number;
    partidoLiberou: number;
    naoSeguiu: number;
    seguiu: number;
    aderencia: number;
    partido: Partido;
    aderenciaTema: Tema;
}

export interface Aderencia {
    idParlamentarVoz: string;
    casa: string;
    nomeEleitoral: string;
    parlamentarPartido: Partido;
    parlamentarAderencia: Array<AderenciaDados>;
}
