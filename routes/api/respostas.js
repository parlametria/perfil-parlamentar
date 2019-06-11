/** Express router
 * @module routes/respostas
 * @requires express
 */
const Sequelize = require("sequelize");
const express = require("express");
const models = require("../../models/index");
const { formataRespostas } = require("../../utils/functions");

const Op = Sequelize.Op;
/**
 * Rotas para funções relacionadas às respostas.
 * @namespace module:routes/respostas
 */
const router = express.Router();

const Resposta = models.resposta;
const Candidato = models.candidato;
const Comissoes = models.comissoes;
const ComposicaoComissoes = models.composicaoComissoes;

const BAD_REQUEST = 400;
const SUCCESS = 200;

const att_res = ["resposta", "pergunta_id"];
const att = [
  "cpf",
  "estado",
  "uf",
  "nome_urna",
  "recebeu",
  "respondeu",
  "eleito",
  "reeleicao",
  "email",
  "sg_partido",
  "partido",
  "tem_foto",
  "n_candidatura"
];

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

  Candidato.count().then((totalCount, err) => {
    let response;
    if (err) response = { error: true, message: "Error fetching data" };

    Candidato.findAll({
      attributes: att,
      include: [
        {
          model: Resposta,
          as: "cpf_resp",
          attributes: att_res
        }
      ],
      offset: query.offset,
      limit: query.limit
    }).then((data, err) => {
      dataNovo = formataRespostas(data);
      response = err
        ? { status: BAD_REQUEST, message: "Error fetching data" }
        : {
          data: dataNovo,
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
  Candidato.findAll({
    attributes: att,
    include: [
      {
        model: ComposicaoComissoes,
        attributes: ["comissao_id", "cargo"],
        include: [
          {
            attributes: ["sigla"],
            model: Comissoes,
            as: "infoComissao",
            required: false
          }
        ],
        as: "cpf_comissoes",
        required: false
      }
    ],
    where: { eleito: true }
  })
    .then(resultado => {
      return res.json(resultado);
    })
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
  Candidato.findAll({
    attributes: att,
    include: [
      {
        model: Resposta,
        as: "cpf_resp",
        attributes: att_res
      }
    ],
    where: { respondeu: true }
  })
    .then(respostas => {
      respostasNovo = formataRespostas(respostas);
      res.json(respostasNovo);
    })
    .catch(err => res.status(BAD_REQUEST).json({ err }));
});

/**
 * Pega todos as respostas de todos que não responderam.
 * @name get/api/respostas/candidatos/naoresponderam
 * @function
 * @memberof module:routes/respostas
 * @param {boolean} respondeu - Flag respondeu false
 */
router.get("/candidatos/naoresponderam", (req, res) => {
  Candidato.findAll({
    attributes: att,
    include: [
      {
        model: Resposta,
        as: "cpf_resp",
        attributes: att_res
      }
    ],
    where: { respondeu: false }
  })
    .then(respostas => {
      respostasNovo = formataRespostas(respostas);
      res.json(respostasNovo);
    })
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
  Candidato.findAll({
    attributes: att,
    include: [
      {
        model: Resposta,
        as: "cpf_resp",
        attributes: att_res
      }
    ],
    where: { cpf: req.params.cpf }
  })
    .then(respostas => {
      respostasNovo = formataRespostas(respostas);
      res.json(respostasNovo);
    })
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

  Candidato.findAll({
    attributes: att,
    include: [
      {
        model: Resposta,
        as: "cpf_resp",
        attributes: att_res
      }
    ],
    where: query
  })
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

  const isFiltrandoPorNome = nome !== "" && nome !== "undefined";
  const isFiltrandoPorPartido =
    partido !== "Partidos" && partido !== "undefined";
  const isFiltrandoPorReeleicao =
    reeleicao !== "-1" && reeleicao !== "undefined";
  const isFiltrandoPorRespondeu =
    respondeu !== "-1" && respondeu !== "undefined";

  query = {};
  if (req.params.uf !== "TODOS") {
    query.uf = req.params.uf;
  }
  if (eleito) {
    query.eleito = eleito;
  }
  if (isFiltrandoPorNome) {
    query.nome_urna = { [Op.iLike]: "%" + nome + "%" };
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

  Candidato.count({
    where: { uf: req.params.uf }
  }).then((totalCount, err) => {
    let response;
    if (err) response = { error: true, message: "Error fetching data" };

    Candidato.findAll({
      attributes: att,
      include: [
        {
          model: Resposta,
          as: "cpf_resp",
          attributes: att_res
        }
      ],
      where: query
    }).then((candidatos, err) => {
      respostasNovo = formataRespostas(candidatos);

      response = err
        ? { status: BAD_REQUEST, message: "Error fetching data" }
        : {
          candidatos: respostasNovo,
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
  Candidato.count({
    where: { uf: req.params.uf, respondeu: true }
  }).then((totalCount, err) => {
    let response;
    if (err) response = { error: true, message: "Error fetching data" };

    Candidato.findAll({
      attributes: att,
      include: [
        {
          model: Resposta,
          as: "cpf_resp",
          attributes: att_res
        }
      ],
      where: { uf: req.params.uf, respondeu: true }
    }).then((candidatos, err) => {
      respostasNovo = formataRespostas(candidatos);

      response = err
        ? { status: BAD_REQUEST, message: "Error fetching data" }
        : {
          candidatos: respostasNovo,
          total: totalCount,
          status: SUCCESS
        };

      res.status(response.status).json(response);
    });
  });
});

// @route   GET api/respostas/estados/<uf>/partidos/
// @desc    Pega as respostas por partido e estado
// @access  Public
router.get("/estados/:uf/partidos/:sigla", (req, res) => {
  Candidato.count({
    where: { uf: req.params.uf, sg_partido: req.params.sigla }
  }).then((totalCount, err) => {
    let response;
    if (err) response = { error: true, message: "Error fetching data" };

    Candidato.findAll({
      attributes: att,
      include: [
        {
          model: Resposta,
          as: "cpf_resp",
          attributes: att_res
        }
      ],
      where: { uf: req.params.uf, sg_partido: req.params.sigla }
    }).then((candidatos, err) => {
      respostasNovo = formataRespostas(candidatos);

      response = err
        ? { status: BAD_REQUEST, message: "Error fetching data" }
        : {
          candidatos: respostasNovo,
          total: totalCount,
          status: SUCCESS
        };

      res.status(response.status).json(response);
    });
  });
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
  Candidato.count({
    where: {
      uf: req.params.uf,
      sg_partido: req.params.sigla,
      respondeu: true
    }
  }).then((totalCount, err) => {
    let response;
    if (err) response = { error: true, message: "Error fetching data" };

    Candidato.findAll({
      attributes: att,
      include: [
        {
          model: Resposta,
          as: "cpf_resp",
          attributes: att_res
        }
      ],
      where: {
        uf: req.params.uf,
        sg_partido: req.params.sigla,
        respondeu: true
      }
    }).then((candidatos, err) => {
      respostasNovo = formataRespostas(candidatos);

      response = err
        ? { status: BAD_REQUEST, message: "Error fetching data" }
        : {
          candidatos: respostasNovo,
          total: totalCount,
          status: SUCCESS
        };

      res.status(response.status).json(response);
    });
  });
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
  Candidato.count({
    where: {
      uf: req.params.uf,
      sg_partido: req.params.sigla,
      respondeu: false
    }
  }).then((totalCount, err) => {
    let response;
    if (err) response = { error: true, message: "Error fetching data" };

    Candidato.findAll({
      attributes: att,
      include: [
        {
          model: Resposta,
          as: "cpf_resp",
          attributes: att_res
        }
      ],
      where: {
        uf: req.params.uf,
        sg_partido: req.params.sigla,
        respondeu: false
      }
    }).then((candidatos, err) => {
      respostasNovo = formataRespostas(candidatos);

      response = err
        ? { status: BAD_REQUEST, message: "Error fetching data" }
        : {
          candidatos: respostasNovo,
          total: totalCount,
          status: SUCCESS
        };

      res.status(response.status).json(response);
    });
  });
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

  query.offset = size * (pageNo - 1);
  query.limit = size;

  Candidato.count({
    where: {
      uf: req.params.uf,
      respondeu: false
    }
  }).then((totalCount, err) => {
    let response;
    if (err) response = { error: true, message: "Error fetching data" };

    Candidato.findAll({
      attributes: att,
      include: [
        {
          model: Resposta,
          as: "cpf_resp",
          attributes: att_res
        }
      ],
      where: {
        uf: req.params.uf,
        respondeu: false
      },
      limit: query.limit,
      offset: query.offset
    }).then((data, err) => {
      respostasNovo = formataRespostas(data);

      response = err
        ? { status: BAD_REQUEST, message: "Error fetching data" }
        : {
          data: respostasNovo,
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
  Candidato.count({
    where: {
      uf: req.params.uf,
      eleito: true
    }
  }).then((totalCount, err) => {
    let response;
    if (err) response = { error: true, message: "Error fetching data" };

    Candidato.findAll({
      attributes: att,
      include: [
        {
          model: Resposta,
          as: "cpf_resp",
          attributes: att_res
        }
      ],
      where: {
        uf: req.params.uf,
        eleito: true
      }
    }).then((candidatos, err) => {
      respostasNovo = formataRespostas(candidatos);

      response = err
        ? { status: BAD_REQUEST, message: "Error fetching data" }
        : {
          candidatos: respostasNovo,
          total: totalCount,
          status: SUCCESS
        };

      res.status(response.status).json(response);
    });
  });
});

module.exports = router;
