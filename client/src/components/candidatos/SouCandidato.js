import React, { Component } from "react";
import { Link } from "react-router-dom";

import "./soucandidato.css";


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
        <section className="sou-candidato">
          <div className="container">
            <h2 className="intro-title text-center">
              É candidato e quer participar?
          </h2>
            <div className="my-3">
              <Link to="/" className="btn btn-link">
                <span className="icon-back" /> Voltar para o quiz
          </Link>
            </div>
          </div>
        </section>

        <div className="container">
          <div className="col-md-4">
            <input
              type="text  "
              pattern="\d{11}"
              maxLength="11" size="11"
              className="form-control form-control-secondary"
              placeholder="Pesquisar CPF do/a candidato/a"
              aria-label="Pesquisar CPF do/a candidato/a"
              aria-describedby="search-candidate"
            //onChange={this.buscaCPF}
            //value={this.state.filtro.cpf}
            />
            <font size="1">*apenas números</font>
          </div>


          <section className="sou-candidato">
            <div className="grid-wrapper">
              <div className="grid-main">
                <section className="grid-panel panel-master">
                  <div className="email-board">

                    Se você é um candidato e por algum motivo não recebeu o nosso e-mail entre em contato conosco através de uma mensagem no <font color="#41c083">contato@vozativa.org</font>.

                    <div align="right">
                      <a href="mailto:'contato@vozativa.org'" >
                        <b>enviar e-mail</b>
                      </a>
                    </div>
                  </div>
                </section>

                <section className="grid-panel panel-master">
                  {candidato = this.candidato ? (
                    //perfil do candidato: nome, partido/UF, cpf, e-mail, recebeu/respondeu
                    <div>
                      {this.candidato} +

                       Um email com o link para participação foi enviado por contato@vozativa.org para o endereço xxx@yyy.zzz.  Caso você queira receber esse link em outro email ou tenha outra dúvida, manda um email pra a gente em contato@vozativa.org que providenciamos.

                       Nós não conseguimos lhe contactar através do endereço xxx@yyy.zzz que está cadastrado no TSE. Para que possamos lhe enviar o link que serve como convite para a plataforma, precisamos de um e-mail que você tenha acesso. Para nos informar esse email, por favor nos contacte informando seu CPF e nome de urna no endereço contato@vozativa.org.
                    </div>
                  ) : (
                      <div>
                        A Voz Ativa enviou um e-mail para todos os candidato/as a deputado federal usando os endereços cadastrados no TSE. Para confirmar para que endereço de e-mail enviamos, digite seu CPF.
                      </div>
                    )}
                </section>
              </div>

            </div>
          </section>
        </div>
      </div>

    )
  }
}

export default SouCandidato;