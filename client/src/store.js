import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers/";
import { firebaseDatabase } from "./services/firebaseService";

const dadosCandidatos = {};
const dbStatus = { carregando: false };
const inicio = Date.now();

firebaseDatabase
  .ref("/resultados")
  .once("value")
  .then(snapshot => {
    const candidatos = snapshot.val();
    const keys = Object.keys(candidatos);
    keys.map(key => {
      dadosCandidatos[candidatos[key].id] = candidatos[key];
    });
    // console.log(dadosCandidatos);
    console.log(Date.now() - inicio);
    // dadosCandidatos = snapshot.val();
    // console.log(dadosCandidatos);
    // console.log(Date.now() - inicio);
    dbStatus["carregando"] = false;
  })
  .catch(err => console.log(err));

const initialState = {
  candidatosReducer: { dadosCandidatos, dbStatus }
};

const middleware = [thunk];

const store = createStore(
  rootReducer,
  initialState,
  compose(
    applyMiddleware(...middleware),
    (window.__REDUX_DEVTOOLS_EXTENSION__ &&
      window.__REDUX_DEVTOOLS_EXTENSION__()) ||
      compose
  )
);

console.log(store.getState());

export default store;
