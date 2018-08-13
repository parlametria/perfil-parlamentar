import React, { Component } from "react";

class Equipe extends Component {
  constructor(props) {
    super(props);
  }

  render(){
    console.log('I was triggered during render')
    return (
      <div>Espaço reservado para a equipe.</div>
    );
  }
}

export default Equipe;
