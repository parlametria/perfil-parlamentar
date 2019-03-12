import React, { Component } from "react";
import { connect } from "react-redux";

import { CopyToClipboard } from "react-copy-to-clipboard";
import { Tooltip } from "reactstrap";

import { criaURL } from "../../constantes/tratamentoUrls";


class CopiaUrl extends Component {
  constructor(props) {
    super(props);

    this.state = { copied: false };
    this.toggle = this.toggle.bind(this);

  }

  toggle() {
    if (this.state.copied) {
      this.setState({
        copied: !this.state.copied
      });
    }
  }

  geraUrl() {
    let hostURL = process.env.REACT_APP_FACEBOOK_REDIRECT_URI;
    const url =
      hostURL +
      this.props.candidatos.filtro.estado +
      "/" +
      criaURL(this.props.usuario.respostasUsuario);
    return url;
  }
  render() {

    return (
      <div
        className="text-center d-sm-block mb-2"
        style={{ marginTop: "-10px" }}
      >
        <CopyToClipboard
          text={this.geraUrl()}
          onCopy={() => this.setState({ copied: true })}
        >
          <button className="btn btn-outline-primary" id="shareBtn">
            compartilhe suas respostas{" "}
          </button>
        </CopyToClipboard>
        <Tooltip
          placement="right"
          isOpen={this.state.copied}
          target="shareBtn"
          toggle={this.toggle}
          delay={{ hide: 1000 }}
        >
          Link copiado!
        </Tooltip>
      </div>
    );
  }
};

CopiaUrl.propTypes = {
}

const mapStateToProps = state => ({
  usuario: state.usuarioReducer,
  candidatos: state.candidatosReducer,
});
export default connect(mapStateToProps, {})(CopiaUrl);