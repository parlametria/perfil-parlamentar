const express = require("express");
const expressJwt = require("express-jwt");

const router = express.Router();

const models = require("../../models/index");
const keys = require("../../config/keys");

const Usuario = models.usuario;
const Resposta = models.respostau;
const Votacao = models.votacaou;
const Tema = models.temasu;

const {  
  formataRespostasUser
} = require("../../utils/functions");

const attRes = ["resposta", "pergunta_id"];
const attVot = ["resposta", "id_votacao"];
const attSecret = ["id"];
const attNone = [];

const BAD_REQUEST = 400;
const SUCCESS = 200;

const authenticate = expressJwt({
  secret: keys.secretOrKey,
  requestProperty: "auth",
  getToken: function (req) {
    if (req.headers["authorization"]) {
      return req.headers["authorization"];
    }
    return null;
  }
});

/**
* @swagger
* tags:
*   name: Usuários
*   description: Módulo com endpoints relacionados aos usuários logados na aplicação Perfil Parlamentar.
*/

/**
* @swagger
* path:
*  /api/usuarios/respostas/:
*    get:
*      summary: Recupera respostas dos usuários ao questionário do Voz Ativa (versão anterior do Perfil Parlamentar).
*      tags: [Usuários]
*      responses:
*        "200":
*          description: Informações das respostas dos usuários ao questionário.
*/
router.get("/respostas", (req, res) => {
  Usuario.findAll({
    attributes: attSecret,
    include: [
      {
        model: Resposta,
        as: "user_resp",
        attributes: attRes
      },
      {
        model: Votacao,
        as: "user_vot",
        attributes: attVot
      }
    ]
  })
    .then(resultado => {
      resultadoNovo = formataRespostasUser(resultado);
      return res.status(SUCCESS).json(resultadoNovo);
    })
    .catch(err => res.status(BAD_REQUEST).json({ err }));
});

/**
* @swagger
* path:
*  /api/usuarios/respostas/eu/:
*    get:
*      summary: Recupera respostas do usuário logado (precisa de autenticação).
*      tags: [Usuários]
*      responses:
*        "200":
*          description: Lista com as respostas do usuário autenticado
*/
router.get("/respostas/eu", authenticate, (req, res) => {
  Usuario.findAll({
    attributes: attNone,
    include: [
      {
        model: Resposta,
        as: "user_resp",
        attributes: attRes
      },
      {
        model: Votacao,
        as: "user_vot",
        attributes: attVot
      }
    ],
    where: { provider_id: req.auth.id }
  })
    .then(resultado => {
      resultadoNovo = formataRespostasUser(resultado);
      return res.status(SUCCESS).json({
        vozAtiva: resultadoNovo[0]["respostas"]["vozAtiva"],
        votacoes: resultadoNovo[0]["respostas"]["votacoes"]
      });
    })
    .catch(err => res.status(BAD_REQUEST).json({ err }));
});

/**
* @swagger
* path:
*  /api/usuarios/respostas/eu/:
*    post:
*      summary: Salva respostas do usuário logado (precisa de autenticação).
*      tags: [Usuários]
*      requestBody:
*        description: Objeto com as respostas do usuário para salvar
*        required: true
*        content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               vozAtiva:
*                 type: object
*               votacoes:
*                 type: object
*             example:
*               vozAtiva: {"1": 1}
*               votacoes: {"2": 0}
*      responses:
*        "200":
*          description: Lista com as respostas do usuário autenticado.
*/
router.post("/respostas/eu", authenticate, (req, res) => {
  const perfil = {};
  perfil.usuario = req.auth.id;

  const idResp = req.query.idResp;

  const vozAtiva = req.body.respostas.vozAtiva;
  const votacoes = req.body.respostas.votacoes;

  Usuario.findOne({ where: { provider_id: req.auth.id } })
    .then(usuario => {
      if (idResp in vozAtiva) {
        Resposta.upsertResp(
          idResp,
          usuario.id,
          vozAtiva[idResp],
          (user, err) => {
            return err, user;
          }
        );
      } else {
        Votacao.upsertResp(
          idResp,
          usuario.id,
          votacoes[idResp],
          (user, err) => {
            return err, user;
          }
        );
      }
    })
    .catch(err => res.status(BAD_REQUEST).json({ err }));
  res.status(SUCCESS).json({ vozAtiva, votacoes });
});

/**
* @swagger
* path:
*  /api/usuarios/respostas/eu/todas:
*    post:
*      summary: Salva todas as respostas do usuário logado (precisa de autenticação).
*      tags: [Usuários]
*      requestBody:
*        description: Objeto com as respostas do usuário para salvar
*        required: true
*        content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               vozAtiva:
*                 type: object
*               votacoes:
*                 type: object
*             example:
*               vozAtiva: {"1": 1}
*               votacoes: {"2": 0}
*      responses:
*        "200":
*          description: Lista com as respostas do usuário autenticado.
*/
router.post("/respostas/eu/todas", authenticate, (req, res) => {

  const vozAtiva = req.body.vozAtiva;
  const votacoes = req.body.votacoes;

  Usuario.findOne({ where: { provider_id: req.auth.id } })
    .then(usuario => {
      Object.keys(vozAtiva).forEach(key => {
        Resposta.upsertResp(
          key,
          usuario.id,
          vozAtiva[key],
          (user, err) => {
            return err, user
          }
        )
      });

      Object.keys(votacoes).forEach(key => {
        Votacao.upsertResp(
          key,
          usuario.id,
          votacoes[key],
          (user, err) => {
            return err, user
          }
        )
      });
    })
    .catch(err => res.status(BAD_REQUEST).json({ err }));

  res.status(SUCCESS).json({ vozAtiva, votacoes });
});

/**
* @swagger
* path:
*  /api/usuarios/temas/eu/:
*    get:
*      summary: Salva temas preferidos do usuário logado (precisa de autenticação).
*      tags: [Usuários]
*      responses:
*        "200":
*          description: Lista com os temas preferidos do usuário autenticado.
*/
router.get("/temas/eu", authenticate, (req, res) => {

  Usuario.findOne({
    attributes: ["id"],
    include: [
      {
        model: Tema,
        attributes: ["usuario_id", "temas_preferidos"],
        as: "user_temas",
        required: false
      }
    ],
    where: { provider_id: req.auth.id }
  })
    .then(usuarioTemas => {
      res.status(SUCCESS).json(usuarioTemas.user_temas);
    })
    .catch(err => res.status(BAD_REQUEST).json({ err }));

});

/**
* @swagger
* path:
*  /api/usuarios/temas/eu/:
*    post:
*      summary: Salva os temas de preferência do usuário logado (precisa de autenticação).
*      tags: [Usuários]
*      requestBody:
*        description: Objeto com os temas de preferência do usuário.
*        required: true
*        content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               usuario_id:
*                 type: integer
*               temas_preferidos:
*                 type: array
*             example:
*               usuario_id: 1
*               temas_preferidos: ["Meio Ambiente", "Agenda Nacional"]
*      responses:
*        "200":
*          description: Lista com os temas de preferência do usuário autenticado.
*/
router.post("/temas/eu", authenticate, (req, res) => {

  const temas = req.body.temas;

  Usuario.findOne({ where: { provider_id: req.auth.id } })
    .then(usuario => {

      Tema.upsertTemas(
        usuario.id,
        temas,
        (temas_user, error) => {
          if (temas_user) {
            const temasSalvos = {
              usuario_id: temas_user.usuario_id,
              temas_preferidos: temas_user.temas_preferidos
            }
            res.status(SUCCESS).json([temasSalvos]);
          }
          if (error)
            res.status(BAD_REQUEST).json(error);
        }
      )
    })
    .catch(err => {
      res.status(BAD_REQUEST).json({ error: err.message })
    });

});

module.exports = router;
