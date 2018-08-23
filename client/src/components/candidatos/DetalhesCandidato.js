import React, { Component } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import TabelaPerguntas from "../tabelaPerguntas/TabelaPerguntas";

class DetalhesCandidato extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      tooltipOpen: false
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal,
      tooltipOpen: !this.state.tooltipOpen
    });
  }


  render() {
    const dados = this.props.dados;
    return (
      <div className="detalhe-deputado">
        <img
          src={dados.foto}
          alt="..."
          width="100px"
          height="100px"
          className="img-thumbnail avatar rounded-circle"
          onClick={this.toggle}
        />
        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle}
          className={this.props.className}
        >
          <ModalHeader toggle={this.toggle}> {dados.nome} </ModalHeader>
          <ModalBody>
            <div className="row">
              <div className="col-md-6 col-sm-12 col-12">
                Partido: {this.props.dados.siglaPartido}
              </div>
              <div className="col-md-6 col-sm-12 col-12">
                UF: {this.props.dados.estado}
              </div>
            </div>
            <TabelaPerguntas dadosCandidatos={dados} />

          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggle}>
              Fechar
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default DetalhesCandidato;
