import React, { Component } from "react";
import CandidatosContainer from "./CandidatosContainer";

class SouCandidato extends Component {
  constructor(props) {
    super(props);

    this.candidato = undefined;

    this.state = { value: '' };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    console.log('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    let candidato;
    return (
      <div className="container">
        <div className="col-4">
          <input
            type="text"
            className="form-control form-control-secondary"
            placeholder="Pesquisar candidato/a..."
            aria-label="Pesquisar candidato/a"
            aria-describedby="search-candidate"
          //onChange={this.buscaNome}
          //value={this.state.filtro.nome}
          />
        </div>


        <div className="row">
          <div className="col-md-6">
            {candidato = this.candidato ? this.candidato : "candidato não definido"}
          </div>
          <div className="col-md-6">
            <form onSubmit={this.handleSubmit}>
              <label>
                Nome:
              <input type="text" value={this.state.value} onChange={this.handleChange} />
              </label>
              <label>
                Sobrenome:
              <input type="text" value={this.state.value} onChange={this.handleChange} />
              </label>

              <label>
                E-mail:
              <input type="text" value={this.state.value} onChange={this.handleChange} />
              </label>

              <label>
                Alguma sugestão ou comentário:
              <input type="text" value={this.state.value} onChange={this.handleChange} />

              </label>

              <input type="submit" value="Submit" />
            </form>
          </div>


        </div>
      </div>
    )
  }
}

export default SouCandidato;