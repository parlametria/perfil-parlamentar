const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Resposta = require("../../models/Resposta");

const BAD_REQUEST = 400;
const SUCCESS = 200;

// @route   GET api/respostas
// @desc    Pega todos as respostas de uma vez
// @access  Public
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

// @route   GET api/respostas/eleitos
// @desc    Pega as respostas de todos os candidatos eleitos
// @access  Public
router.get("/eleitos", (req, res) => {
  Resposta.find({ eleito: true })
    .then(respostas => res.json(respostas))
    .catch(err => res.status(BAD_REQUEST).json({ err }));
});

// @route   GET api/respostas/candidatos/<cpf>
// @desc    Pega as respostas de um candidato dado o seu cpf
// @access  Public
router.get("/candidatos/:cpf", (req, res) => {
  Resposta.find({ cpf: req.params.cpf })
    .then(respostas => res.json(respostas))
    .catch(err => res.status(BAD_REQUEST).json({ err }));
});

// @route   GET api/respostas/candidatos/responderam
// @desc    Pega todos as respostas de todos que responderam
// @access  Public
router.get("/candidatos/responderam", (req, res) => {
  Resposta.find({ respondeu: true })
    .then(respostas => res.json(respostas))
    .catch(err => res.status(BAD_REQUEST).json({ err }));
});

// @route   GET api/respostas
// @desc    Pega todas as respostas de quem NÃO respondeu
// @access  Public
router.get("/candidatos/naoresponderam", (req, res) => {
  Resposta.find({ respondeu: false })
    .then(respostas => res.json(respostas))
    .catch(err => res.status(BAD_REQUEST).json({ err }));
});

// @route   GET api/respostas/estados/<uf>/partidos
// @desc    Pega todos os partidos de um estado
// @access  Public
router.get("/estados/:uf/partidos", (req, res) => {
  Resposta.find({ uf: req.params.uf })
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

// @route   GET api/respostas/estados/<uf>?partido=<partido>&nome=<nome>&responderam=<responderam>&reeleicao=<reeleicao>
// @desc    Pega as respostas por estado
// @access  Public
router.get("/estados/:uf", (req, res) => {
  query = {};
  const partido = String(req.query.partido);
  const nome = String(req.query.nome);

  const responderam =
    String(req.query.responderam) !== "-1"
      ? Number(req.query.responderam) !== -1
        ? true
        : false
      : String(req.query.responderam);

  const reeleicao = String(req.query.reeleicao);
  const pattern = new RegExp(nome, "i");

  const isFiltrandoPorNome = nome !== "";
  const isFiltrandoPorPartido = partido !== "Partidos";
  const isFiltrandoPorReeleicao = reeleicao !== "-1";
  const isFiltrandoPorRespondeu = responderam !== "-1";

  query = {};
  query.uf = req.params.uf;

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
    query.respondeu = responderam;
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

// @route   GET api/respostas/estados/<uf>/responderam
// @desc    Pega as respostas por estado de quem respondeu
// @access  Public
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

// @route   GET api/respostas/estados/<uf>/partidos/<sigla>/responderam
// @desc    Pega as respostas por partido e estado de quem respondeu
// @access  Public
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

// @route   GET api/respostas/estados/<uf>/partidos/<sigla>/naoresponderam
// @desc    Pega as respostas por partido e estado de quem NÃO respondeu
// @access  Public
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

// @route   GET api/respostas/estados/<uf>/naoresponderam
// @desc    Pega as respostas por estado de quem NÃO respondeu
// @access  Public
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
