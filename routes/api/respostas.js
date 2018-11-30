/** Express router
 * @module routes/respostas
 * @requires express
 */

const express = require("express");
const models = require("../../models/index");
/**
 * Rotas para funções relacionadas às respostas.
 * @namespace module:routes/respostas
 */
const router = express.Router();

const Resposta = models.resposta;
const Candidato = models.candidato;

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

  query.offset = size * (pageNo - 1);
  query.limit = size;

  Resposta.findAndCountAll({}, (err, totalCount) => {
    let response;
    if (err) response = { error: true, message: "Error fetching data" };

    Resposta.findAll({}, {}, query, (err, data) => {
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
  Resposta.findAll({
    include: [{ model: Candidato, as: "cpf_resp", where: { eleito: true } }]
  })
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
 * Pega todos os partidos de um estado.
 * @name get/api/respostas/estados/<uf>/partidos?eleito=<eleito>
 * @function
 * @memberof module:routes/respostas
 * @param {string} uf - Estado
 */
router.get("/estados/:uf/partidos", (req, res) => {
  const eleito =
    String(req.query.eleito) !== "" && String(req.query.eleito) !== "undefined";
  const query = {};
  if (req.params.uf !== "TODOS") {
    query.uf = req.params.uf;
  }
  if (eleito) {
    query.eleito = eleito;
  }

  Resposta.find(query)
    .then(respostas => {
      const partidosSet = new Set();
      respostas.forEach(resposta => {
        partidosSet.add(resposta.sg_partido);
      });
      let partidos = Array.from(partidosSet).sort((a, b) => a.localeCompare(b));
      partidos.splice(0, 0, "Partidos");
      res.json({ data: partidos });
    })
    .catch(err => res.status(BAD_REQUEST).json({ err }));
});

/**
 * Pega as respostas por estado.
 * @name get/api/respostas/estados/<uf>?partido=<partido>&nome=<nome>&respondeu=<respondeu>&reeleicao=<reeleicao>
 * @function
 * @memberof module:routes/respostas
 * @param {string} uf - Estado
 */
router.get("/estados/:uf", (req, res) => {
  const partido = String(req.query.partido);
  const nome = String(req.query.nome);
  const eleito =
    String(req.query.eleito) !== "" && String(req.query.eleito) !== "undefined";
  const respondeu =
    String(req.query.respondeu) !== "-1"
      ? Number(req.query.respondeu) !== -1
        ? true
        : false
      : String(req.query.respondeu);

  const reeleicao = String(req.query.reeleicao);
  const pattern = new RegExp(nome, "i");

  const isFiltrandoPorNome = nome !== "";
  const isFiltrandoPorPartido = partido !== "Partidos";
  const isFiltrandoPorReeleicao = reeleicao !== "-1";
  const isFiltrandoPorRespondeu = respondeu !== "-1";

  query = {};
  if (req.params.uf !== "TODOS") {
    query.uf = req.params.uf;
  }
  if (eleito) {
    query.eleito = eleito;
  }
  if (isFiltrandoPorNome) {
    query.nome_urna = { $regex: pattern };
  }
  if (isFiltrandoPorPartido) {
    query.sg_partido = partido;
  }
  if (isFiltrandoPorReeleicao) {
    query.reeleicao = reeleicao;
  }
  if (isFiltrandoPorRespondeu) {
    query.respondeu = respondeu;
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

// @route   GET api/respostas/estados/<uf>/partidos/
// @desc    Pega as respostas por partido e estado de quem respondeu
// @access  Public
router.get("/estados/:uf/partidos/:sigla", (req, res) => {
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

/**
 *  Pega as respostas por estado de quem se elegeu.
 * @name get/api/respostas/estados/<uf>/eleitos
 * @memberof module:routes/respostas
 * @param {string} UF - Estado
 */
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
