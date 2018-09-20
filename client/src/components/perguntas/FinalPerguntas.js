import React, { Component } from "react";
import { BrowserView, MobileView } from "react-device-detect";

class FinalPerguntas extends Component {
  render() {
    let linkCompartilhamento = "";
    let textoCompartilhamento = "";
    return (
      <div>
        <h2 className="panel-title text-center">[frase de parabéns]</h2>
        <span className="navbar-text navbar-text-strong">compartilhe</span>
        <div className="row justify-content-end">
          <a
            href={
              "https://twitter.com/intent/tweet/?text=" + textoCompartilhamento
            }
            data-show-count="false"
            className="nav-link"
            target="_blank"
          >
            <span className="icon-twitter" />
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
            <span className="icon-facebook" />
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
              <span className="icon-whatsapp" />
            </a>
          </BrowserView>
          <MobileView>
            <a
              href={"whatsapp://send?text=" + textoCompartilhamento}
              className="nav-link"
            >
              <span className="icon-whatsapp" />
            </a>
          </MobileView>
        </div>
        voltar
      </div>
    );
  }
}

export default FinalPerguntas;
