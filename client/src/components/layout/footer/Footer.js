import React from "react";

export default () => {
  return (
    <div>
      <footer>
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <h4 className="footer-title">O que é a Rede Advocacy?</h4>
              <p>
                Somos uma rede de 30 organizações da sociedade civil que atuam de forma colaborativa para inovar a participação da sociedade no processo de elaboração de políticas públicas no Brasil.
              </p>
              <p>O Voz ativa não divulga seus dados</p>
            </div>
            <div className="footer-logo col-md-4">
              <div className="row no-gutters">
                <div className="col-6 offset-3">
                  <img
                    src={require("../../../data/img/logo.png")}
                    alt="Voz Ativa"
                    width="100%"
                  />
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <h4 className="footer-title">Realização</h4>
              <div className="d-flex align-items-center">
                <div className="col">
                  <img
                    src={require("../../../data/img/logo_dadocapital.jpg")}
                    alt="Dado Capital"
                    width="100%"
                  />
                </div>
                <div className="col">
                  <img
                    src={require("../../../data/img/logo_ufcg.jpg")}
                    alt="UFCG"
                    width="100%"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
