import React, { Component } from "react";
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
    <div className="search-person-profile row">
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
        <h5 className="person-name">{dadosCandidatoBusca.nome_urna}</h5>
        <div>
          {dadosCandidatoBusca.sg_partido}/{dadosCandidatoBusca.uf}
        </div>
        <div>CPF {dadosCandidatoBusca.cpf}</div>
        <br />
        <div>
          E-mail{" "}
          <strong>
            {dadosCandidatoBusca.email === "#NULO#"
              ? "Indisponível"
              : dadosCandidatoBusca.email}
          </strong>
        </div>
      </div>
    </div>
  );
  candidatoNaoEncontrado = (
    <div>Candidato não encontrado. Verifique se o CPF digitado é válido.</div>
  );

  textoDefaultCandidato = <div />;

  textoDefaultEmail = <div />;

  emailCandidato = dadosCandidatoBusca => (
    <div className="email-board">
      <p>
        Um email com o link para participação foi enviado de{" "}
        <strong className="strong">
          <a href="mailto:contato@vozativa.org" className="link-inverse">
            contato@vozativa.org
          </a>
        </strong>{" "}
        para o endereço de e-mail:
      </p>
      <h5>{dadosCandidatoBusca.email}</h5>
      <br />
      <p>
        Caso você queira receber esse link em outro e-mail ou tenha qualquer
        dúvida, escreve pra gente em{" "}
        <a href="mailto:contato@vozativa.org" className="link-inverse">
          contato@vozativa.org
        </a>
        .
      </p>
    </div>
  );

  naoRecebeu = dadosCandidatoBusca => (
    <div className="email-board">
      <p>
        Nós não conseguimos lhe contactar através do endereço{" "}
        {dadosCandidatoBusca.email} que está cadastrado no TSE.{" "}
      </p>
      <p>
        {" "}
        Para que possamos lhe enviar o link que serve como convite para a
        plataforma, precisamos de um e-mail que você tenha acesso. Para nos
        informar esse email, por favor nos contacte informando seu CPF e nome de
        urna no endereço{" "}
        <a href="mailto:contato@vozativa.org" className="link-inverse">
          contato@vozativa.org
        </a>
        .
      </p>
    </div>
  );

  emailNulo = dadosCandidatoBusca => (
    <div className="email-board">
      <p>
        Nós não conseguimos encontrar um e-mail válido para lhe contactar. Para
        que possamos lhe enviar o link que serve como convite para a plataforma,
        precisamos de um e-mail que você tenha acesso.
      </p>
      <p>
        Para nos informar esse email, por favor nos contacte informando seu CPF
        e nome de urna no endereço{" "}
        <a href="mailto:contato@vozativa.org" className="link-inverse">
          contato@vozativa.org
        </a>
        .
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
      if (dadosCandidatoBusca.email === "#NULO#") {
        gridEmail = this.emailNulo(dadosCandidatoBusca);
      } else {
        gridEmail = dadosCandidatoBusca.recebeu
          ? this.emailCandidato(dadosCandidatoBusca)
          : this.naoRecebeu(dadosCandidatoBusca);
      }
    }

    return (
      <div className="container">
        <h4 className="compare-title text-center">
          É candidato e quer participar?
        </h4>
        <div className="d-flex justify-content-center py-3">
          <div className="col-md-8">
            <p>
              A Voz Ativa enviou um e-mail para todos os candidato/as a deputado
              federal usando os endereços cadastrados no TSE.
            </p>
            <p>
              Para confirmar para qual endereço de e-mail enviamos, digite seu
              CPF.
            </p>
          </div>
        </div>

        <div className="d-flex justify-content-center py-3">
          <div className="col-md-5">
            <form onSubmit={this.handleSubmit}>
              <div className="form-group">
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
                <small className="form-text text-muted">* apenas números</small>
              </div>
            </form>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">{gridCandidato}</div>
          <div className="col-md-6">{gridEmail}</div>
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
