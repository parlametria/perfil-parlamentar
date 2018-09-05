import React, { Component } from "react";

import PieChart from "react-minimal-pie-chart";

import isEmpty from "../../../validation/is-empty";
import Spinner from "../../common/Spinner";

class PontuacaoTema extends Component {
  render() {
    let pontuacoesTemas;
    if (!isEmpty(this.props.scoreTema)) {
      pontuacoesTemas = Object.keys(this.props.scoreTema).map(tema => (
        <div key={tema} className="score-theme-wrapper">
          <div>
            <span className="icon-minus strong" /> {tema}
          </div>
          <div className="row no-gutters d-flex align-items-center">
            <div className="col-5 offset-2 col-lg-4">
              <div className="score-pie-chart">
                <PieChart
                  data={[
                    {
                      value: 100 - Math.round(this.props.scoreTema[tema] * 100),
                      color: "#eeeeee"
                    },
                    {
                      value: Math.round(this.props.scoreTema[tema] * 100),
                      color: "#a963b3"
                    }
                  ]}
                  // reveal={Math.round(this.props.scoreTema[tema] * 100)}
                  animate
                  lineWidth={25}
                />
              </div>
            </div>
            <div className="col-5">
              <div className="score-theme">
                {Math.round(this.props.scoreTema[tema] * 100) + "%"}
              </div>
            </div>
          </div>
        </div>
      ));

      return <div>{pontuacoesTemas}</div>;
    }
    return <Spinner />;
  }
}

export default PontuacaoTema;
