import React, { Component } from "react";
import { Table, Pagination, PaginationItem, PaginationLink } from "reactstrap";
import isEmpty from "../../../validation/is-empty";
import { connect } from "react-redux";

import { getDadosPerguntas } from "../../../actions/perguntasActions";

import sanitizeHtml from "sanitize-html";

import PropTypes from "prop-types";

import classnames from "classnames";

class TabelaVotacoes extends Component {
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
    return (
      <div className="table-responsive">
        <Table className="table-bordered" hover pagination={{ pageSize: 5 }}>
          <thead className="thead-dark">
            <tr>
              <th className="table-th-question">Proposições</th>
              <th className="table-th-candidate">Candidato/a</th>
            </tr>
          </thead>
          {}
        </Table>
      </div>
    );
  }
}

export default TabelaVotacoes;
