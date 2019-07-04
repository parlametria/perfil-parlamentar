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
 * Salva todas as respostas
 * @name get/api/usuarios/respostas/eu/todas
 * @function
 * @memberof module:routes/usuarios
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
 * Recupera todos os temas de preferência de um usuário
 * @name get/api/usuarios/temas/eu
 * @function
 * @memberof module:routes/usuarios
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
 * Salva os temas de preferência do usuário
 * @name get/api/usuarios/temas/eu
 * @function
 * @memberof module:routes/usuarios
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
