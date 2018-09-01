import React from "react";
import { Route, Switch } from "react-router-dom";
import CalculoContainer from "./components/calculo/CalculoContainer";
import Equipe from "./components/equipe/Equipe";
import Home from "./components/layout/home/Home";
import CompareContainer from "./components/compare/CompareContainer";

// The Main component renders one of provided
// Routes (provided that one matches). The / route will only match
// when the pathname is exactly the string "/"
const Main = () => (
  <main>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/calculo" component={CalculoContainer} />
      <Route exact path="/equipe" component={Equipe} />
      <Route
        exact
        path="/compare/:candidato/:votos"
        component={CompareContainer}
      />
      <Route exact path="/compare/:candidato/" component={CompareContainer} />
    </Switch>
  </main>
);

export default Main;
