import React, { Component } from "react";
import { BrowserView, MobileView } from "react-device-detect";

class FinalPerguntas extends Component {
  render() {
    return (
      <div>
        <h2 className="panel-title text-center">[frase de parabéns]</h2>

        <span className="navbar-text navbar-text-strong">compartilhe</span>
        <ul className="navbar-nav navbar-inline">
          <li className="nav-item">
            <a
              href="https://twitter.com/intent/tweet/?text=Nos diga o que você defende e em oito minutos a gente apresenta candidatos alinhados com você. http://vozativa.org/"
              data-show-count="false"
              className="nav-link nav-strong"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="icon-twitter share-icon" />
            </a>
          </li>
          <li className="nav-item">
            <a
              href="https://www.facebook.com/sharer/sharer.php?u=http%3A%2F%2Fvozativa.org%2F&amp;src=sdkpreparse"
              data-show-count="false"
              className="nav-link nav-strong"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="icon-facebook share-icon" />
            </a>
          </li>
          <BrowserView>
            <li className="nav-item">
              <a
                href="https://web.whatsapp.com/send?text=Nos diga o que você defende e em oito minutos a gente apresenta candidatos alinhados com você. http://vozativa.org/"
                data-show-count="false"
                className="nav-link nav-strong"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="icon-whatsapp share-icon" />
              </a>
            </li>
          </BrowserView>
          <MobileView>
            <li className="nav-item">
              <a
                href="whatsapp://send?text=Nos diga o que você defende e em oito minutos a gente apresenta candidatos alinhados com você. http://vozativa.org/"
                className="nav-link nav-strong"
              >
                <span className="icon-whatsapp share-icon" />
              </a>
            </li>
          </MobileView>
        </ul>
      </div>
    );
  }
}

export default FinalPerguntas;
