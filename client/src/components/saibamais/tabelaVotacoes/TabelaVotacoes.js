import React, { Component } from "react";
import { Table, Pagination, PaginationItem, PaginationLink } from "reactstrap";
import isEmpty from "../../../validation/is-empty";
import { connect } from "react-redux";

import { getDadosVotacoes } from "../../../actions/votacoesActions";

import PropTypes from "prop-types";

class TabelaVotacoes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      paginaAtual: 1,
      votacoesPorPagina: 10
    };
    this.qntPaginas = 0;
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event, index) {
    event.preventDefault();
    this.setState({
      paginaAtual: index
    });
  }

  componentDidMount() {
    this.props.getDadosVotacoes();
  }

  render() {
    const { dadosVotacoes } = this.props.votacoes;
    const { paginaAtual, votacoesPorPagina } = this.state;

    const votacoesCandidato = this.props.candidatos.dadosCandidato.votacoes;

    const { votacoes: respostasUsuario } = this.props.usuario.respostasUsuario;

    let votacoes = [];

    Object.keys(dadosVotacoes).map(i => {
      return votacoes.push({
        key: dadosVotacoes[i].id,
        id_votacao: dadosVotacoes[i].id_votacao,
        id_projeto: dadosVotacoes[i].numero_proj_lei,
        tema: dadosVotacoes[i].tema,
        titulo: dadosVotacoes[i].titulo,
        descricao: dadosVotacoes[i].descricao
      });
    });

    function getValorVotacao(num) {
      switch (num) {
        case 1:
          return "Sim";
        case 0:
          return "--";
        case -1:
          return "Não";
        case -2:
          return "Não sabe";
        case 2:
          return "Obstrução";
        case 3:
          return "Abstenção";
        case 4:
          return "Art. 17";
        default:
          return "--";
      }
    }

    function getClassVotacao(num) {
      switch (num) {
        case 1:
          return "in-favor";
        case 0:
          return "";
        case -1:
          return "against";
        case -2:
          return "dont-know";
        case 2:
          return "dont-know";
        case 3:
          return "dont-know";
        case 4:
          return "dont-know";
        default:
          return "--";
      }
    }

    let rows,
      indicePrimeiro,
      indiceUltimo,
      votacoesExibidas,
      renderNumeroPaginas;
    if (!isEmpty(votacoes) && !isEmpty(votacoesCandidato)) {
      indiceUltimo = paginaAtual * votacoesPorPagina;
      indicePrimeiro = indiceUltimo - votacoesPorPagina;
      votacoesExibidas = votacoes.slice(indicePrimeiro, indiceUltimo);

      let temaExibido = "";
      let change = false;
      rows = votacoesExibidas.map((elem, index) => {
        if (temaExibido !== elem.tema) {
          temaExibido = elem.tema;
          change = true;
        } else {
          change = false;
        }

        return (
          <tbody key={"tbody" + index}>
            <tr key={"tema" + temaExibido}>
              {change ? (
                <td colSpan="3" className="table-title">
                  {temaExibido}
                </td>
              ) : null}
            </tr>
            <tr key={elem.key}>
              <td
                dangerouslySetInnerHTML={{
                  __html:
                    "<b>" +
                    elem.id_projeto +
                    " - " +
                    elem.titulo +
                    "</b>" +
                    "</br> " +
                    elem.descricao
                }}
              />

              <td
                className={
                  "text-center table-row-center " +
                  getClassVotacao(votacoesCandidato[elem.id_votacao])
                }
              >
                {getValorVotacao(votacoesCandidato[elem.id_votacao])}
              </td>
              <td
                className={
                  "text-center table-row-center " +
                  getClassVotacao(respostasUsuario[elem.id_votacao])
                }
              >
                {getValorVotacao(respostasUsuario[elem.id_votacao])}
              </td>
            </tr>
          </tbody>
        );
      });
    }

    const numeroPaginas = [];
    for (let i = 1; i <= Math.ceil(votacoes.length / votacoesPorPagina); i++) {
      numeroPaginas.push(i);
    }

    renderNumeroPaginas = numeroPaginas.map(num => {
      return (
        <PaginationLink
          key={num}
          id={num}
          onClick={e => this.handleClick(e, num)}
        >
          {num}
        </PaginationLink>
      );
    });
    this.qntPaginas = numeroPaginas.length;

    return (
      <div className="table-responsive">
        <Table className="table-bordered" hover pagination={{ pageSize: 5 }}>
          <thead className="thead-dark">
            <tr>
              <th className="table-th-question">Proposições</th>
              <th className="table-th-candidate">Candidato/a</th>
              <th className="table-th-candidate">Você</th>
            </tr>
          </thead>
          {rows}
        </Table>

        <Pagination aria-label="Navegação da tabela" size="sm">
          <PaginationItem disabled={paginaAtual <= 1}>
            <PaginationLink
              previous
              id={paginaAtual - 1}
              onClick={e => this.handleClick(e, paginaAtual - 1)}
            />
          </PaginationItem>

          {renderNumeroPaginas}

          <PaginationItem disabled={paginaAtual >= this.qntPaginas}>
            <PaginationLink
              next
              id={paginaAtual + 1}
              onClick={e => this.handleClick(e, paginaAtual + 1)}
            />
          </PaginationItem>
        </Pagination>
      </div>
    );
  }
}

TabelaVotacoes.propTypes = {
  getDadosVotacoes: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  votacoes: state.votacoesReducer,
  candidatos: state.candidatosReducer,
  usuario: state.usuarioReducer
});

export default connect(
  mapStateToProps,
  { getDadosVotacoes }
)(TabelaVotacoes);
