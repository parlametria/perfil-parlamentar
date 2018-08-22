import React, { Component } from "react";
import {Table} from 'reactstrap';

import { connect } from "react-redux";
import PropTypes from "prop-types";

class TabelaVotacoes extends Component{
    render(){
        const {dadosCandidatos} = this.props;
        const {dadosPerguntas} = this.props.perguntas;
        const {dadosUsuario} = this.props.usuario;
        console.log(dadosUsuario)
        let votacoesCandidato = dadosCandidatos.respostas;
        let votacoesUsuario = this.props.votacoesUsuario;

        function getValorVotacao(num) {
            switch (num) {
              case 1:
                return "Sim";
                break;
              case 0:
                return "Não sabe";
                break;
              case -1:
                return "Não";
                break;
            }
          }


        return(
            <Table>
                <thead>
                <tr>
                    <th>Pergunta</th>
                    <th>Votos de {dadosCandidatos.nome.substr(0,dadosCandidatos.nome.indexOf(' '))}</th>
                    <th>Seus votos</th>
                </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{dadosPerguntas[0]}</td>
                        <td>{getValorVotacao(votacoesCandidato[0])}</td>
                        <td>}</td>
                    </tr>
                </tbody>
            </Table>
        )
    }
}
TabelaVotacoes.propTypes = {
  };
  const mapStateToProps = state => ({
    usuario: state.usuarioReducer,
    perguntas: state.perguntasReducer
  });
  
  export default connect(
    mapStateToProps,
    { }
  )(TabelaVotacoes);
