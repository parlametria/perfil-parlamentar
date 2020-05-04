const Sequelize = require("sequelize");
const express = require("express");
const models = require("../../models/index");
const { formataRespostas } = require("../../utils/functions");

const Op = Sequelize.Op;
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
* @swagger
* tags:
*   name: Respostas
*   description: Recupera as respostas do questionário do Voz Ativa (antigo nome para o Perfil Parlamentar).
*/


/**
* @swagger
* path:
*  /api/respostas/:
*    get:
*      deprecated: true
*      summary: Recupera as respostas relacionadas ao questionário do Voz Ativa.
*      tags: [Respostas]
*      responses:
*        "200":
*          description: Lista com as respostas dos candidatos ao questionário do Voz Ativa.
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
* @swagger
* path:
*  /api/respostas/eleitos:
*    get:
*      deprecated: true
*      summary: Recupera as respostas dos candidatos eleitos no questionário do Voz Ativa.
*      tags: [Respostas]
*      responses:
*        "200":
*          description: Lista com as respostas dos candidatos ao questionário do Voz Ativa.
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
* @swagger
* path:
*  /api/respostas/candidatos/responderam:
*    get:
*      deprecated: true
*      summary: Recupera as respostas dos candidatos que responderam ao questionário do Voz Ativa.
*      tags: [Respostas]
*      responses:
*        "200":
*          description: Lista com as respostas dos candidatos ao questionário do Voz Ativa.
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
* @swagger
* path:
*  /api/respostas/candidatos/naoresponderam:
*    get:
*      deprecated: true
*      summary: Recupera as respostas dos candidatos que não responderam ao questionário do Voz Ativa.
*      tags: [Respostas]
*      responses:
*        "200":
*          description: Lista com as respostas dos candidatos ao questionário do Voz Ativa.
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
* @swagger
* path:
*  /api/respostas/candidatos/{cpf}:
*    get:
*      deprecated: true
*      summary: Recupera as respostas de um candidato ao questionário do Voz Ativa.
*      tags: [Respostas]
*      parameters:
*        - in: path
*          name: cpf
*          schema:
*            type: string
*          required: true
*          description: CPF do candidato
*      responses:
*        "200":
*          description: Lista com a resposta do candidato ao questionário do Voz Ativa.
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
* @swagger
* path:
*  /api/respostas/estados/{uf}/partidos:
*    get:
*      deprecated: true
*      summary: Recupera os partidos distintos presentes em uma UF.
*      tags: [Respostas]
*      parameters:
*        - in: path
*          name: uf
*          schema:
*            type: string
*          required: true
*          description: UF para o filtro
*      responses:
*        "200":
*          description: Lista com os partidos distintos com candidatos em uma UF.
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
* @swagger
* path:
*  /api/respostas/estados/{uf}:
*    get:
*      deprecated: true
*      summary: Recupera as respostas ao questionário Voz Ativa de apenas um estado.
*      tags: [Respostas]
*      parameters:
*        - in: path
*          name: uf
*          schema:
*            type: string
*          required: true
*          description: UF para o filtro
*      responses:
*        "200":
*          description: Lista com as respostas de todos os candidatos de um estado
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
* @swagger
* path:
*  /api/respostas/estados/{uf}/responderam:
*    get:
*      deprecated: true
*      summary: Recupera as respostas ao questionário Voz Ativa de apenas um estado. 
*                Filtrando apenas quem respondeu.
*      tags: [Respostas]
*      parameters:
*        - in: path
*          name: uf
*          schema:
*            type: string
*          required: true
*          description: UF para o filtro
*      responses:
*        "200":
*          description: Lista com as respostas dos candidatos de um estado
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

/**
* @swagger
* path:
*  /api/respostas/estados/{uf}/partidos/{sigla}:
*    get:
*      deprecated: true
*      summary: Recupera as respostas ao questionário filtrando por uma UF e um partido.
*      tags: [Respostas]
*      parameters:
*        - in: path
*          name: uf
*          schema:
*            type: string
*          required: true
*          description: UF para o filtro
*        - in: path
*          name: sigla
*          schema:
*            type: string
*          required: true
*          description: Sigla do partido para o filtro
*      responses:
*        "200":
*          description: Lista com as respostas dos candidatos de uma UF e um partido
*/
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
* @swagger
* path:
*  /api/respostas/estados/{uf}/partidos/{sigla}/responderam:
*    get:
*      deprecated: true
*      summary: Recupera as respostas ao questionário filtrando por uma UF e um partido (apenas quem respondeu).
*      tags: [Respostas]
*      parameters:
*        - in: path
*          name: uf
*          schema:
*            type: string
*          required: true
*          description: UF para o filtro
*        - in: path
*          name: sigla
*          schema:
*            type: string
*          required: true
*          description: Sigla do partido para o filtro
*      responses:
*        "200":
*          description: Lista com as respostas dos candidatos (que responderam ao questionário) de uma UF e um partido.
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
* @swagger
* path:
*  /api/respostas/estados/{uf}/partidos/{sigla}/naoresponderam:
*    get:
*      deprecated: true
*      summary: Recupera as respostas ao questionário filtrando por uma UF e um partido (apenas quem não respondeu).
*      tags: [Respostas]
*      parameters:
*        - in: path
*          name: uf
*          schema:
*            type: string
*          required: true
*          description: UF para o filtro
*        - in: path
*          name: sigla
*          schema:
*            type: string
*          required: true
*          description: Sigla do partido para o filtro
*      responses:
*        "200":
*          description: Lista com as respostas dos candidatos (que não responderam ao questionário) de uma UF e um partido.
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
* @swagger
* path:
*  /api/respostas/estados/{uf}/naoresponderam:
*    get:
*      deprecated: true
*      summary: Recupera as respostas ao questionário Voz Ativa de apenas um estado. 
*                Filtrando apenas quem não respondeu.
*      tags: [Respostas]
*      parameters:
*        - in: path
*          name: uf
*          schema:
*            type: string
*          required: true
*          description: UF para o filtro
*      responses:
*        "200":
*          description: Lista com as respostas dos candidatos (apenas quem não respondeu) de um estado.
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
* @swagger
* path:
*  /api/respostas/estados/{uf}/eleitos:
*    get:
*      deprecated: true
*      summary: Recupera as respostas ao questionário Voz Ativa de apenas um estado. 
*                Filtrando apenas quem foi eleito.
*      tags: [Respostas]
*      parameters:
*        - in: path
*          name: uf
*          schema:
*            type: string
*          required: true
*          description: UF para o filtro
*      responses:
*        "200":
*          description: Lista com as respostas dos candidatos de um estado (apenas quem foi eleito).
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
