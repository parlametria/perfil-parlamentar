import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Toggle from 'react-toggle';
import PerguntasContainer from "../perguntas/PerguntasContainer";
import VotacoesContainer from "../votacoes/VotacoesContainer";
import "./questionario.css";

import { mudaBandeja } from "../../actions/questionarioActions";


class QuestionarioContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { isOn: false };
    this.handleToggle = this.handleToggle.bind(this);
    this.bandejaAtiva = "Voz Ativa" //se mudar, lembra de mudar no reducer o default também

  }

  handleToggle(e) {
    this.setState({ isOn: !this.state.isOn });
    this.bandejaAtiva = this.bandejaAtiva === "Voz Ativa" ? "Votacoes" : "Voz Ativa"
    this.props.mudaBandeja(this.bandejaAtiva);
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
            {/* <VotacoesContainer /> */}
            rs
          </div>
        }
        {!this.state.isOn &&
          <div>
            < PerguntasContainer />
          </div>
        }
      </div>
    )
  }
};

QuestionarioContainer.propTypes = {
  mudaBandeja: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  questionario: state.questionarioReducer
});

export default connect(
  mapStateToProps,
  { mudaBandeja }
)(QuestionarioContainer);
