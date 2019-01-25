import React from "react";
import { Route, Switch } from "react-router-dom";
import CalculoContainer from "./components/calculo/CalculoContainer";
import Sobre from "./components/sobre/Sobre";
import Home from "./components/layout/home/Home";
import SaibaMaisContainer from "./components/saibamais/SaibaMaisContainer";
import SouCandidato from "./components/candidatos/SouCandidato";

// The Main component renders one of provided
// Routes (provided that one matches). The / route will only match
// when the pathname is exactly the string "/"
const Main = () => (
  <main>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route
        exact
        path="/candidato/:candidato/"
        render={props => <SaibaMaisContainer {...props} />}
      />
      <Route
        exact
        path="/candidato/:candidato/:verAtuacao"
        render={props => <SaibaMaisContainer {...props} />}
      />
      <Route
        exact
        path="/:estado/:votos"
        render={props => <Home {...props} />}
      />
      <Route exact path="/calculo" component={CalculoContainer} />
      <Route exact path="/sobre" component={Sobre} />      
      <Route
        exact
        path="/compare/:candidato/:votos"
        render={props => <SaibaMaisContainer {...props} />}
      />
      <Route
        exact
        path="/compare/:candidato/:votos/:verAtuacao"
        render={props => <SaibaMaisContainer {...props} />}
      />
      <Route exact path="/soucandidato" component={SouCandidato} />
    </Switch>
  </main>
);

export default Main;
