/** Express router
 * @module routes/respostas
 * @requires express
 */

const express = require("express");

/**
 * Rotas para funções relacionadas às respostas.
 * @namespace module:routes/respostas
 */
const router = express.Router();
const mongoose = require("mongoose");

const Resposta = require("../../models/Resposta");

const BAD_REQUEST = 400;
const SUCCESS = 200;

/**
 * Pega todas as respostas de uma vez.
 * @name get/api/respostas
 * @function
 * @memberof module:routes/respostas
 */
router.get("/", (req, res) => {
  const pageNo = Number(req.query.pageNo);
  const size = Number(req.query.size);
  const uf = req.params.uf;
  let query = {};

  if (pageNo < 0 || pageNo === 0) {
    response = {
      error: true,
      message: "invalid page number, should start with 1"
    };
    return res.json(response);
  }

  query.skip = size * (pageNo - 1);
  query.limit = size;

  Resposta.countDocuments({}, (err, totalCount) => {
    let response;
    if (err) response = { error: true, message: "Error fetching data" };

    Resposta.find({}, {}, query, (err, data) => {
      response = err
        ? { status: BAD_REQUEST, message: "Error fetching data" }
        : {
          data,
          total: totalCount,
          itensPorPagina: size,
          pagina: pageNo,
          paginas: Math.ceil(totalCount / size),
          status: SUCCESS
        };

      res.status(response.status).json(response);
    });
  });
});


/**
 * Pega as respostas de todos os candidatos eleitos
 * @name get/api/respostas/eleitos
 * @function
 * @memberof module:routes/respostas
 * @param {boolean} eleito - Flag eleito true
 */
router.get("/eleitos", (req, res) => {
  Resposta.find({ eleito: true })
    .then(respostas => res.json(respostas))
    .catch(err => res.status(BAD_REQUEST).json({ err }));
});

/**
 * Pega as respostas de um candidato dado o seu cpf.
 * @name get/api/respostas/candidatos/<cpf>
 * @function
 * @memberof module:routes/respostas
 * @param {string} cpf - CPF do candidato
 */
router.get("/candidatos/:cpf", (req, res) => {
  Resposta.find({ cpf: req.params.cpf })
    .then(respostas => res.json(respostas))
    .catch(err => res.status(BAD_REQUEST).json({ err }));
});

/**
 * Pega todos as respostas de todos que responderam.
 * @name get/api/respostas/candidatos/responderam
 * @function
 * @memberof module:routes/respostas
 * @param {boolean} respondeu - Flag respondeu true
 */
router.get("/candidatos/responderam", (req, res) => {
  Resposta.find({ respondeu: true })
    .then(respostas => res.json(respostas))
    .catch(err => res.status(BAD_REQUEST).json({ err }));
});

/**
 * Pega todos as respostas de todos que não responderam.
 * @name get/api/respostas/candidatos/responderam
 * @function
 * @memberof module:routes/respostas
 * @param {boolean} respondeu - Flag respondeu false
 */
router.get("/candidatos/naoresponderam", (req, res) => {
  Resposta.find({ respondeu: false })
    .then(respostas => res.json(respostas))
    .catch(err => res.status(BAD_REQUEST).json({ err }));
});

/**
 * Pega as respostas por estado.
 * @name get/api/respostas/estados/<uf>
 * @function
 * @memberof module:routes/respostas
 * @param {string} UF - Estado
 */
router.get("/estados/:uf", (req, res) => {
  query = {};
  const partido = String(req.query.partido);
  const nome = String(req.query.nome);
  const pattern = new RegExp(nome, "i");
  console.log(pattern);

  if (nome !== "undefined" && partido !== "undefined") {
    query = {
      uf: req.params.uf,
      sg_partido: partido,
      nome_urna: { $regex: pattern }
    };
  } else if (nome !== "undefined" && partido === "undefined") {
    query = { uf: req.params.uf, nome_urna: { $regex: pattern } };
  } else if (partido !== "undefined" && nome === "undefined") {
    query = { uf: req.params.uf, sg_partido: partido };
  } else {
    query = { uf: req.params.uf };
  }
  console.log(query);

  Resposta.countDocuments({ uf: req.params.uf }, (err, totalCount) => {
    let response;
    if (err) response = { error: true, message: "Error fetching data" };

    Resposta.find(query, (err, candidatos) => {
      response = err
        ? { status: BAD_REQUEST, message: "Error fetching data" }
        : {
          candidatos,
          total: totalCount,
          status: SUCCESS
        };

      res.status(response.status).json(response);
    });
  });
});

/**
 * Pega as respostas por estado de quem respondeu.
 * @name get/api/respostas/estados/<uf>/responderam
 * @function
 * @memberof module:routes/respostas
 * @param {string} UF - Estado
 * @param {boolean} respondeu - Flag respondeu true
 */
router.get("/estados/:uf/responderam", (req, res) => {
  Resposta.find({ uf: req.params.uf, respondeu: true })
    .then(respostas => res.json(respostas))
    .catch(err => res.status(BAD_REQUEST).json({ err }));
});

/**
 * Pega o número de candidatos que responderam por estado.
 * @name get/api/respostas/estados/<uf>/responderam/totalcandidatos
 * @function
 * @memberof module:routes/respostas
 * @param {string} UF - Estado
 * @param {boolean} respondeu - Flag respondeu true
 */
router.get("/estados/:uf/responderam/totalcandidatos", (req, res) => {
  Resposta.countDocuments(
    { uf: req.params.uf, respondeu: true },
    (err, totalCount) => {
      let response;
      if (err) response = { error: true, message: "Error fetching data" };

      Resposta.find(
        { uf: req.params.uf, respondeu: true },
        (err, candidatos) => {
          response = err
            ? { status: BAD_REQUEST, message: "Error fetching data" }
            : {
              candidatos,
              total: totalCount,
              status: SUCCESS
            };

          res.status(response.status).json(response);
        }
      );
    }
  );
});

/**
 * Pega o número de candidatos que responderam por estado.
 * @name get/api/respostas/estados/<uf>/totalcandidatos
 * @memberof module:routes/respostas
 * @param {string} UF - Estado
 */
router.get("/estados/:uf/totalcandidatos", (req, res) => {
  Resposta.countDocuments({ uf: req.params.uf }, (err, totalCount) => {
    if (!err) res.json(totalCount);
    else res.status(400).json(err);
  });
});

/**
 * Pega o total de respostas por estado e partido.
 * @name get/api/respostas/estados/<uf>/partidos/<sigla>/totalcandidatos
 * @memberof module:routes/respostas
 * @param {string} UF - Estado
 * @param {string} sigla - Sigla do partido
 */
router.get("/estados/:uf/partidos/:sigla/totalcandidatos", (req, res) => {
  Resposta.countDocuments(
    {
      uf: req.params.uf,
      sg_partido: req.params.sigla
    },
    (err, totalCount) => {
      let response;
      if (err) response = { error: true, message: "Error fetching data" };

      Resposta.find(
        {
          uf: req.params.uf,
          sg_partido: req.params.sigla
        },
        (err, candidatos) => {
          response = err
            ? { status: BAD_REQUEST, message: "Error fetching data" }
            : {
              candidatos,
              total: totalCount,
              status: SUCCESS
            };

          res.status(response.status).json(response);
        }
      );
    }
  );
});

/**
 * Pega o total de respostas por partido e estado de quem respondeu.
 * @name get/api/respostas/estados/<uf>/partidos/<sigla>/responderam/totalcandidatos
 * @memberof module:routes/respostas
 * @param {string} UF - Estado
 * @param {string} sigla - Sigla do partido
 * @param {boolean} respondeu - Flag respondeu true
 */
router.get(
  "/estados/:uf/partidos/:sigla/responderam/totalcandidatos",
  (req, res) => {
    Resposta.countDocuments(
      { uf: req.params.uf, sg_partido: req.params.sigla, respondeu: true },
      (err, totalCount) => {
        if (!err) res.json(totalCount);
        else res.status(400).json(err);
      }
    );
  }
);

/**
 * Pega as respostas por partido e estado de quem respondeu.
 * @name get/api/respostas/estados/<uf>/partidos/<sigla>/responderam
 * @memberof module:routes/respostas
 * @param {string} UF - Estado
 * @param {string} sigla - Sigla do partido
 * @param {boolean} respondeu - Flag respondeu true
 */
router.get("/estados/:uf/partidos/:sigla/responderam", (req, res) => {
  Resposta.countDocuments(
    {
      uf: req.params.uf,
      sg_partido: req.params.sigla,
      respondeu: true
    },
    (err, totalCount) => {
      let response;
      if (err) response = { error: true, message: "Error fetching data" };

      Resposta.find(
        {
          uf: req.params.uf,
          sg_partido: req.params.sigla,
          respondeu: true
        },
        (err, candidatos) => {
          response = err
            ? { status: BAD_REQUEST, message: "Error fetching data" }
            : {
              candidatos,
              total: totalCount,
              status: SUCCESS
            };

          res.status(response.status).json(response);
        }
      );
    }
  );
});

/**
 * Pega as respostas por partido e estado de quem NÃO respondeu.
 * @name get/api/respostas/estados/<uf>/partidos/<sigla>/naoresponderam
 * @memberof module:routes/respostas
 * @param {string} UF - Estado
 * @param {string} sigla - Sigla do partido
 * @param {boolean} respondeu - Flag respondeu false
 */
router.get("/estados/:uf/partidos/:sigla/naoresponderam", (req, res) => {
  Resposta.countDocuments(
    {
      uf: req.params.uf,
      sg_partido: req.params.sigla,
      respondeu: false
    },
    (err, totalCount) => {
      let response;
      if (err) response = { error: true, message: "Error fetching data" };

      Resposta.find(
        {
          uf: req.params.uf,
          sg_partido: req.params.sigla,
          respondeu: false
        },
        (err, candidatos) => {
          response = err
            ? { status: BAD_REQUEST, message: "Error fetching data" }
            : {
              candidatos,
              total: totalCount,
              status: SUCCESS
            };

          res.status(response.status).json(response);
        }
      );
    }
  );
});

/**
 *  Pega as respostas por estado de quem NÃO respondeu.
 * @name get/api/respostas/estados/<uf>
 * @memberof module:routes/respostas
 * @param {string} UF - Estado
 * @param {boolean} respondeu - Flag respondeu false
 */
router.get("/estados/:uf/naoresponderam", (req, res) => {
  const pageNo = Number(req.query.pageNo);
  const size = Number(req.query.size);
  const uf = req.params.uf;
  let query = {};

  if (pageNo < 0 || pageNo === 0) {
    response = {
      error: true,
      message: "invalid page number, should start with 1"
    };
    return res.json(response);
  }

  query.skip = size * (pageNo - 1);
  query.limit = size;

  Resposta.countDocuments({ uf, respondeu: false }, (err, totalCount) => {
    let response;
    if (err) response = { error: true, message: "Error fetching data" };

    Resposta.find({ uf, respondeu: false }, {}, query, (err, data) => {
      response = err
        ? { status: BAD_REQUEST, message: "Error fetching data" }
        : {
          data,
          total: totalCount,
          itensPorPagina: size,
          pagina: pageNo,
          paginas: Math.ceil(totalCount / size),
          status: SUCCESS
        };

      res.status(response.status).json(response);
    });
  });
});

// @route   GET api/respostas/estados/<uf>/eleitos
// @desc    Pega as respostas por estado de quem se elegeu
// @access  Public
router.get("/estados/:uf/eleitos", (req, res) => {
  Resposta.countDocuments(
    { uf: req.params.uf, eleito: true },
    (err, totalCount) => {
      let response;
      if (err) response = { error: true, message: "Error fetching data" };

      Resposta.find({ uf: req.params.uf, eleito: true }, (err, candidatos) => {
        response = err
          ? { status: BAD_REQUEST, message: "Error fetching data" }
          : {
            candidatos,
            total: totalCount,
            status: SUCCESS
          };

        res.status(response.status).json(response);
      });
    }
  );
});

module.exports = router;
