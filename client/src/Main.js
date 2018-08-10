import React from 'react'
import { Route, Router, Switch } from 'react-router-dom'
import CalculoContainer from './components/calculo/CalculoContainer'
import Equipe from './components/equipe/Equipe'
import Home from './components/layout/Home';

// The Main component renders one of provided
// Routes (provided that one matches). The / route will only match
// when the pathname is exactly the string "/"
const Main = () => (
  <main>
    <Switch>
      <Route exact path="/" component={Home}/>
      <Route path="/calculo" component={CalculoContainer}/>
      <Route path='/equipe' component={Equipe}/>
    </Switch>
  </main>
)

export default Main
