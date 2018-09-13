import { CandidatosContainer } from '../components/candidatos/CandidatosContainer';

export const BuscaService = {
  buscaNome,
  buscaPartido,
  buscaCPF
};


//acessar o reducer, buscar de acordo com o "tipo" e retornar uma lista de candidatos que batem com o filtro
function buscaNome(nome) {
  e.preventDefault();

  let filtro = {
    nome: e.target.value,
    partido: this.props.candidatos.filtro.partido,
    estado: this.props.candidatos.filtro.estado
  };

  this.setState({ filtro, isPesquisando: true });
  this.props.setFiltroCandidatos(filtro);
  this.onSearch$.next(filtro.nome);
};

function buscaPartido(e) {
  e.preventDefault();

  let filtro = {
    nome: this.props.candidatos.filtro.nome,
    partido: e.target.value,
    estado: this.props.candidatos.filtro.estado
  };

  this.setState({ filtro });
  this.props.setFiltroCandidatos(filtro);
};

function buscaCPF(e) {
  e.preventDefault();

};