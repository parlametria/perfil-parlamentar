import React, { Component } from "react";
import Toggle from 'react-toggle';
import PerguntasContainer from "../perguntas/PerguntasContainer";
import VotacoesContainer from "../votacoes/VotacoesContainer";
import "./questionario.css";


class QuestionarioContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { isOn: false };
    this.handleToggle = this.handleToggle.bind(this);

  }

  handleToggle(e) {
    this.setState({ isOn: !this.state.isOn });
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
          <VotacoesContainer />
        }
        {!this.state.isOn &&
          < PerguntasContainer />

        }
      </div>
    )
  }
}

export default QuestionarioContainer;