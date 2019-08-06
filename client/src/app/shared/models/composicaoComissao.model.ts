interface ComissaoInfo {
  sigla: string;
  nome?: string;
}

export interface ComposicaoComissao {
  idComissaoVoz: string;
  cargo: string;
  infoComissao: ComissaoInfo;
}
