import React, { Component } from "react";
import { Table } from 'reactstrap';
import isEmpty from '../../validation/is-empty';
import { connect } from "react-redux";
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

class TabelaVotacoes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activePage: 1
        };
        this.handlePageChange = this.handlePageChange.bind(this);
    }

    handlePageChange(pageNumber) {
        console.log(`active page is ${pageNumber}`);
        this.setState({ activePage: pageNumber });
    }

    render() {
        const { dadosCandidatos } = this.props;
        const { dadosPerguntas } = this.props.perguntas;
        const { arrayRespostasUsuario } = this.props.usuario;

        const perguntas = []
        Object.keys(dadosPerguntas).map(tema => (
            dadosPerguntas[tema].map(p => {
                return perguntas.push(p.pergunta);
            })
        ))

        let votacoesCandidato = dadosCandidatos.respostas;

        function getValorVotacao(num) {
            switch (num) {
                case 1:
                    return "Sim";
                    break;
                case 0:
                    return "Não respondeu";
                    break;
                case -1:
                    return "Não";
                    break;
                case -2:
                    return "Não sabe";
                    break;
            }
        }

        var rows = [];
        if (!isEmpty(perguntas)) {
            perguntas.map((elem, i) => (
                /*<tr key={i}>
                    <td>{perguntas[i]}</td>
                    <td>{getValorVotacao(votacoesCandidato[i])}</td>
                    <td>{getValorVotacao(arrayRespostasUsuario[i])}</td>
                </tr>*/
                rows.push({
                    id: i,
                    pergunta: perguntas[i],
                    votoCandidato: getValorVotacao(votacoesCandidato[i]),
                    votoUsuario: getValorVotacao(arrayRespostasUsuario[i])
                })
            ));
        }
        console.log(rows);


        return (
            <div>
                <Table size="sm" responsive hover pagination={{ pageSize: 5 }}>
                    <thead>
                        <tr>
                            <th>Tema</th>
                            <th>Votos de {dadosCandidatos.nome.substr(0, dadosCandidatos.nome.indexOf(' '))}</th>
                            <th>Seus votos</th>
                        </tr>
                    </thead>
                    <tbody>

                    </tbody>
                </Table>
                <BootstrapTable
                    data={rows}
                    pagination>
                    <TableHeaderColumn dataField='pergunta' isKey>Product ID</TableHeaderColumn>
                    <TableHeaderColumn dataField='votoCandidato'>Product Name</TableHeaderColumn>
                    <TableHeaderColumn dataField='votoUsuario'>Product Price</TableHeaderColumn>
                </BootstrapTable>
            </div>
        )
    }
}
TabelaVotacoes.propTypes = {
};
const mapStateToProps = state => ({
    usuario: state.usuarioReducer,
    perguntas: state.perguntasReducer
});

export default connect(
    mapStateToProps,
    {}
)(TabelaVotacoes);
