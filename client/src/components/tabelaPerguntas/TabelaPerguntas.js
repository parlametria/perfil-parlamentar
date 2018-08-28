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
        this.qntPaginas = 0;
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event, index) {
        event.preventDefault();
        this.setState({
            paginaAtual: index
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
                        onClick={e => this.handleClick(e, num)}
                    >

                        {num}
                    </PaginationLink>
                );
            });
            this.qntPaginas = numeroPaginas.length;


        }

        const indiceAnterior = (paginaAtual - 1 );
        const indiceProximo = (paginaAtual  + 1 );


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
                <Pagination aria-label="Navegação da tabela" size="sm">
                    <PaginationItem disabled = {paginaAtual <= 1}>
                        <PaginationLink previous id={indiceAnterior} onClick={e => this.handleClick(e, paginaAtual - 1)} />
                    </PaginationItem>

                    {renderNumeroPaginas}

                    <PaginationItem disabled = {paginaAtual >= this.qntPaginas -1}>
                        <PaginationLink next id={indiceProximo} onClick={e => this.handleClick(e, paginaAtual + 1)} />
                    </PaginationItem>
                    
                </Pagination>

            </div>
        );
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
