interface AderenciaDados {
    partido: string;
    faltou: number;
    partidoLiberou: number;
    naoSeguiu: number;
    seguiu: number;
    aderencia: number;
}

export interface Aderencia {
    idParlamentarVoz: string;
    casa: string;
    nomeEleitoral: string;
    partido: string;
    parlamentarAderencia: Array<AderenciaDados>;
}
