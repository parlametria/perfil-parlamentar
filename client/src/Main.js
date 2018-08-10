import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Calculo from './components/calculo/Calculo'
import Equipe from './components/equipe/Equipe'
import Home from './components/layout/Home';

// The Main component renders one of provided
// Routes (provided that one matches). The / route will only match
// when the pathname is exactly the string "/"
const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Home}/>
      <Route path='/calculo' component={Calculo}/>
      <Route path='/equipe' component={Equipe}/>
    </Switch>
  </main>
)

export default Main
