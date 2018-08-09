import React, { Component } from "react";
import PropTypes from "prop-types";

class Equipe extends Component {
  render() {
    return (
      <div className="equipe">
      </div>
    );
  }
}

Equipe.propTypes = {
  nome: PropTypes.string.isRequired,
  descricao: PropTypes.string.isRequired,
};

export default Equipe;
