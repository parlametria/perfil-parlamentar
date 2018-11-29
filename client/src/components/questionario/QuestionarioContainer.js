import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Toggle from 'react-toggle';

import PerguntasContainer from "../perguntas/PerguntasContainer";
import VotacoesContainer from "../votacoes/VotacoesContainer";
import "./questionario.css";
import MenuTema from "./MenuTema";

import { mudaAba } from "../../actions/questionarioActions";


class QuestionarioContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { isOn: false };
    this.handleToggle = this.handleToggle.bind(this);
    this.abaAtiva = "Voz Ativa" //se mudar, lembra de mudar no reducer o default também

  }

  handleToggle(e) {
    this.setState({ isOn: !this.state.isOn });
    this.abaAtiva = this.abaAtiva === "Voz Ativa" ? "Votacoes" : "Voz Ativa"
    this.props.mudaAba(this.abaAtiva);
  }

  render() {
    return (
      <div>
        <label>
          <span>Voz Ativa</span>
          <Toggle
            defaultChecked={this.state.isOn}
            icons={false}
            onChange={this.handleToggle} />
          <span>Câmara</span>
        </label>
        {this.state.isOn &&
          <div>
            <MenuTema />

            <VotacoesContainer />

          </div>
        }
        {!this.state.isOn &&
          <div>
            <MenuTema />

            < PerguntasContainer />
          </div>
        }
      </div>
    )
  }
};

QuestionarioContainer.propTypes = {
  mudaAba: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  questionario: state.questionarioReducer
});

export default connect(
  mapStateToProps,
  { mudaAba }
)(QuestionarioContainer);
