import React, { Component } from "react";
import { BrowserView, MobileView } from "react-device-detect";

class FinalPerguntas extends Component {
  render() {
    let linkCompartilhamento = "";
    let textoCompartilhamento = "";
    return (
      <div className="container tutorial p-3">
        <div className="text-center">
          <img
            src={require("../../data/img/step2.png")}
            width="80px"
            alt="Imagem de ícones representando candidatos e uma barra de proximidade com os mesmos"
          />
        </div>
        <h4 className="text-center p-3">
          Veja os candidatos alinhados com você.
        </h4>

        <div className="text-center">
          <button
            className="btn btn-outline-primary"
          >
            Ver agora
          </button>{" "}
          <button
            className="btn btn-outline-primary"
          >
            Continuar respondendo
          </button>
          <div className="p-3">
            Ou compartilhe <br/>
            <div className="row justify-content-center">
              <a
                href={
                  "https://twitter.com/intent/tweet/?text=" + textoCompartilhamento
                }
                data-show-count="false"
                className="nav-link"
                target="_blank"
              >
                <span className="icon-twitter share-icon" />
              </a>
              <a
                href={
                  "https://www.facebook.com/sharer/sharer.php?u=http%3A%2F%2F" +
                  "vozativa.org/"
                }
                data-show-count="false"
                className="nav-link"
                target="_blank"
              >
                <span className="icon-facebook share-icon" />
              </a>
              <BrowserView>
                <a
                  href={
                    "https://web.whatsapp.com/send?text=" + textoCompartilhamento
                  }
                  data-show-count="false"
                  className="nav-link"
                  target="_blank"
                >
                  <span className="icon-whatsapp share-icon" />
                </a>
              </BrowserView>
              <MobileView>
                <a
                  href={"whatsapp://send?text=" + textoCompartilhamento}
                  className="nav-link"
                >
                  <span className="icon-whatsapp share-icon" />
                </a>
              </MobileView>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default FinalPerguntas;
