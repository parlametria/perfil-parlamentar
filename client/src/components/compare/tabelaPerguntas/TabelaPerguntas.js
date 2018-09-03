import React, { Component } from "react";
import { Table, Pagination, PaginationItem, PaginationLink } from "reactstrap";
import isEmpty from "../../../validation/is-empty";
import { connect } from "react-redux";

import { getDadosCandidato } from "../../../actions/candidatosActions";

import PropTypes from "prop-types";

class TabelaPerguntas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      paginaAtual: 1,
      perguntasPorPagina: 10
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

  render() {
    const { paginaAtual, perguntasPorPagina } = this.state;

    const { dadosPerguntas } = this.props.perguntas;
    const { arrayRespostasUsuario } = this.props.usuario;

    const perguntas = [];
    Object.keys(dadosPerguntas).map(p => {
      return perguntas.push({
        key: dadosPerguntas[p].id,
        pergunta: dadosPerguntas[p].texto
      });
    });

    let votacoesCandidato = this.props.respostas;

    function getValorVotacao(num) {
      switch (num) {
        case 1:
          return "Sim";
          break;
        case 0:
          return "Não respondeu";
          break;
        case -1:
          return "Não";
          break;
        case -2:
          return "Não sabe";
          break;
      }
    }

    let rows,
      indicePrimeiro,
      indiceUltimo,
      perguntasExibidas,
      renderNumeroPaginas;

    if (!isEmpty(perguntas)) {
      indiceUltimo = paginaAtual * perguntasPorPagina;
      indicePrimeiro = indiceUltimo - perguntasPorPagina;
      perguntasExibidas = perguntas.slice(indicePrimeiro, indiceUltimo);

      rows = perguntasExibidas.map(elem => (
        <tr key={elem.key}>
          <td>{perguntasExibidas[elem.key % perguntasPorPagina].pergunta}</td>
          <td>{getValorVotacao(votacoesCandidato[elem.key])}</td>
          <td>{getValorVotacao(arrayRespostasUsuario[elem.key])}</td>
        </tr>
      ));

      const numeroPaginas = [];
      for (
        let i = 1;
        i <= Math.ceil(perguntas.length / perguntasPorPagina);
        i++
      ) {
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
    }

    return (
      <div>
        <Table size="sm" responsive hover pagination={{ pageSize: 5 }}>
          <thead>
            <tr>
              <th>Tema</th>
              <th>
                Votos de{" "}
                {this.props.nome.substr(0, this.props.nome.indexOf(" "))}
              </th>
              <th>Seus votos</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
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
TabelaPerguntas.propTypes = {
  getDadosCandidato: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
  usuario: state.usuarioReducer,
  perguntas: state.perguntasReducer
});

export default connect(
  mapStateToProps,
  { getDadosCandidato }
)(TabelaPerguntas);
