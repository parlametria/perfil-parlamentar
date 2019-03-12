import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Toggle from "react-toggle";
import { Tooltip } from 'reactstrap';

import PerguntasContainer from "../perguntas/PerguntasContainer";
import VotacoesContainer from "../votacoes/VotacoesContainer";
import "./questionario.css";
import MenuTema from "./MenuTema";

import { mudaAba } from "../../actions/questionarioActions";

import FinalQuestionario from "./FinalQuestionario";
import FinalVotacoes from "./FinalVotacoes";
import FinalVozAtiva from "./FinalVozAtiva";

class QuestionarioContainer extends Component {
  constructor(props) {
    super(props);
    this.handleToggle = this.handleToggle.bind(this);
    this.toggle = this.toggle.bind(this);
    this.state = {
      tooltipOpen: false
    };
  }

  handleToggle(e) {
    const { abaAtiva } = this.props.questionario;

    this.props.mudaAba(abaAtiva === "Voz Ativa" ? "Votacoes" : "Voz Ativa");
  }
  toggle() {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen
    });
  }

  render() {
    const { abaAtiva, isContinuarRespondendo } = this.props.questionario;
    const {
      respondeuTodos,
      respondeuVozAtiva,
      respondeuVotacoes
    } = this.props.usuario;

    return (
      <div className="toogle-wrapper">
        {abaAtiva === "Votacoes" && (
          <div>
            <MenuTema />
            
            {respondeuVotacoes &&
              isContinuarRespondendo.votacoes &&
              !respondeuTodos && <VotacoesContainer />}
            {respondeuVotacoes &&
              !isContinuarRespondendo.votacoes &&
              !respondeuTodos && <FinalVotacoes />}
            {!respondeuVotacoes && !respondeuTodos && <VotacoesContainer />}
            {respondeuTodos && !isContinuarRespondendo.todos && (
              <FinalQuestionario />
            )}
            {isContinuarRespondendo.todos && <VotacoesContainer />}
          </div>
        )}
      </div>
    );
  }
}

QuestionarioContainer.propTypes = {
  mudaAba: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  questionario: state.questionarioReducer,
  usuario: state.usuarioReducer
});

export default connect(
  mapStateToProps,
  { mudaAba }
)(QuestionarioContainer);
