import React, { Component } from "react";

import { OverlayTrigger, Tooltip } from 'react-bootstrap';

class Comissao extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <OverlayTrigger
                overlay={
                    <Tooltip> {this.props.comissao.comissao_id === "0" ?
                        this.props.comissao.info_comissao.nome :
                        this.props.comissao.cargo + ' na ' + this.props.comissao.info_comissao.nome}
                    </Tooltip>}>
                <span style={{ marginRight: "5px" }} className="badge badge-success">
                    {this.props.comissao.info_comissao.sigla}
                </span>
            </OverlayTrigger>
        )
    }
}

export default Comissao;
