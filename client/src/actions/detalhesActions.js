import React, { Component } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

class MostraDetalhes extends Component {
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
    const dados = this.props.Dados;
    return (
      <div className="detalhe-deputado">
        <img
          src="http://www.luizaerundina.com.br/images/site/luiza.png"
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
            Partido: {this.props.Dados.siglaPartido} <br />
            UF: {this.props.Dados.estado}
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

export default MostraDetalhes;
