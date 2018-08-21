import React, { Component } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

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

  fazTabelaComparacao(dados){
    return (
      <table class="table">
        <thead>
          <tr>
            <th scope="col">Pergunta</th>
            <th scope="col">Votos de {dados.nome.substr(0,dados.nome.indexOf(' '))}</th>
            <th scope="col">Seus votos</th>
          </tr>
        </thead>
      </table>
    );
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
            {this.fazTabelaComparacao(dados)}
            
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
