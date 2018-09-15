import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { buscaPorCPF } from "../../actions/candidatosActions";
import Spinner from "../common/Spinner";
import "./soucandidato.css";

class SouCandidato extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cpf: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ cpf: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.buscaPorCPF(this.state.cpf);
  }

  perfilCandidato = dadosCandidatoBusca => (
    <div className = "search-person-profile row">
      <div className="col-4">
        <img
          src={
            dadosCandidatoBusca.tem_foto
              ? "https://s3-sa-east-1.amazonaws.com/fotoscandidatos2018/fotos_tratadas/img_" +
                dadosCandidatoBusca.cpf +
                ".jpg"
              : "http://pontosdevista.pt/static/uploads/2016/05/sem-fotoABC.jpg"
          }
          alt={dadosCandidatoBusca.nome_urna}
          width="100%"
          className="person-img"
        />
      </div>
      <div className="col-8">
        <p>Nome: {dadosCandidatoBusca.nome_urna}</p>
        <p>
          Partido: {dadosCandidatoBusca.sg_partido}/{dadosCandidatoBusca.uf}
        </p>
        <p>CPF: {dadosCandidatoBusca.cpf}</p>
        <p>E-mail: {dadosCandidatoBusca.email}</p>
      </div>
    </div>
  );
  candidatoNaoEncontrado = (
    <div>Candidato não encontrado. Verifique se o CPF digitado é válido.</div>
  );

  textoDefaultCandidato = (
    <div>
      A Voz Ativa enviou um e-mail para todos os candidato/as a deputado federal
      usando os endereços cadastrados no TSE. Para confirmar para que endereço
      de e-mail enviamos, digite seu CPF.
    </div>
  );

  textoDefaultEmail = (
    <div>
      Se você é um candidato e por algum motivo não recebeu o nosso e-mail entre
      em contato conosco através de uma mensagem no contato@vozativa.org.{" "}
    </div>
  );

  emailCandidato = dadosCandidatoBusca => (
    <div>
      <p>
        Um email com o link para participação foi enviado por
        contato@vozativa.org para o endereço de e-mail{" "}
        {dadosCandidatoBusca.email}.{" "}
      </p>
      <p>
        Caso você queira receber esse link em outro email ou tenha outra dúvida,
        manda um email pra a gente em contato@vozativa.org que providenciamos.{" "}
      </p>
    </div>
  );
  render() {
    const { dadosCandidatoBusca, isCarregando } = this.props.candidatos;

    let gridCandidato;
    let gridEmail;

    if (isCarregando) {
      gridCandidato = <Spinner />;
      gridEmail = <Spinner />;
    } else if (dadosCandidatoBusca === null) {
      gridCandidato = this.candidatoNaoEncontrado;
      gridEmail = this.textoDefaultEmail;
    } else if (Object.keys(dadosCandidatoBusca).length === 0) {
      gridCandidato = this.textoDefaultCandidato;
      gridEmail = this.textoDefaultEmail;
    } else if (Object.keys(dadosCandidatoBusca).length !== 0) {
      gridCandidato = this.perfilCandidato(dadosCandidatoBusca);
      gridEmail = this.emailCandidato(dadosCandidatoBusca);
    }

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
          <div className="col-md-6">
            <form onSubmit={this.handleSubmit}>
              <label>
                <input
                  type="text  "
                  maxLength="11"
                  size="11"
                  className="form-control form-control-secondary"
                  placeholder="cpf"
                  aria-label="Pesquisar CPF do/a candidato/a"
                  aria-describedby="search-candidate"
                  value={this.state.cpf}
                  onChange={this.handleChange}
                />
              </label>
            </form>
            <font size="1">*apenas números</font>
          </div>

          <section className="sou-candidato-board">
            <div className="grid-wrapper">
              <div className="grid-main">
                <section className="grid-panel panel-master">
                  <div className="email-board">{gridEmail}</div>
                </section>

                <section className="grid-panel panel-master">
                  <div className="profile-board"> {gridCandidato} </div>
                </section>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }
}

//export default SouCandidato;
SouCandidato.propTypes = {
  buscaPorCPF: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
  candidatos: state.candidatosReducer
});

export default connect(
  mapStateToProps,
  { buscaPorCPF }
)(SouCandidato);
