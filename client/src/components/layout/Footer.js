import React from "react";

export default () => {
  return (
    <div>
      <footer className="bg-dark text-white mt-0 p-0 text-center fixed-bottom footer">
        Copyright &copy; {new Date().getFullYear()} Voz Ativa
        <p className="icon-spacing">
          <a href="#">
            <i className="fab fa-facebook" />
          </a>
          <a href="#">
            <i className="fab fa-github" />
          </a>
          <a href="#">
            <i className="fab fa-instagram" />
          </a>
        </p>
      </footer>
    </div>
  );
};
