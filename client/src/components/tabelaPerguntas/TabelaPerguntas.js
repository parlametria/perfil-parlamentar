import React, { Component } from "react";
import { Table, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import isEmpty from '../../validation/is-empty';
import { connect } from "react-redux";

class TabelaPerguntas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            paginaAtual: 1,
            perguntasPorPagina: 10
        };
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event) {
        event.preventDefault();
        this.setState({
            paginaAtual: Number(event.target.id)
        });
    }

    render() {
        const { paginaAtual, perguntasPorPagina } = this.state;

        const { dadosCandidatos } = this.props;
        const { dadosPerguntas } = this.props.perguntas;
        const { arrayRespostasUsuario } = this.props.usuario;

        const perguntas = [];
        Object.keys(dadosPerguntas).map(tema => (
            dadosPerguntas[tema].map(p => {
                return perguntas.push({
                    key: p.key,
                    pergunta: p.pergunta
                });
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

        let rows, indicePrimeiro, indiceUltimo, perguntasExibidas, renderNumeroPaginas;
        if (!isEmpty(perguntas)) {
            indiceUltimo = paginaAtual * perguntasPorPagina;
            indicePrimeiro = indiceUltimo - perguntasPorPagina;
            perguntasExibidas = perguntas.slice(indicePrimeiro, indiceUltimo);

            rows = perguntasExibidas.map((elem) => (
                < tr key={elem.key} >
                    <td>{perguntasExibidas[elem.key % perguntasPorPagina].pergunta}</td>
                    <td>{getValorVotacao(votacoesCandidato[elem.key])}</td>
                    <td>{getValorVotacao(arrayRespostasUsuario[elem.key])}</td>
                </tr >
            ));

            const numeroPaginas = [];
            for (let i = 1; i <= Math.ceil(perguntas.length / perguntasPorPagina); i++) {
                numeroPaginas.push(i);
            }

            renderNumeroPaginas = numeroPaginas.map(num => {
                return (
                    <PaginationLink
                        key={num}
                        id={num}
                        onClick={this.handleClick}
                    >

                        {num}
                    </PaginationLink>
                );
            });


        }

        const indiceAnterior = paginaAtual > 1 ? ((paginaAtual - 1) + "") : (paginaAtual + "");
        const indiceProximo = paginaAtual < 5 ? ((paginaAtual + 1) + "") : (paginaAtual + "");


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
                        {rows}
                    </tbody>
                </Table>
                <Pagination aria-label="Page navigation example" size="sm">
                    <PaginationLink previous id={indiceAnterior} onClick={this.handleClick} />
                    {renderNumeroPaginas}
                    <PaginationLink next id={indiceProximo} onClick={this.handleClick} />
                </Pagination>

            </div>
        )
    }
}
TabelaPerguntas.propTypes = {
};
const mapStateToProps = state => ({
    usuario: state.usuarioReducer,
    perguntas: state.perguntasReducer
});

export default connect(
    mapStateToProps,
    {}
)(TabelaPerguntas);
