const express = require("express");
const router = express.Router();
const { generateToken, sendToken } = require("../../utils/token.utils");

const passport = require("passport");
const expressJwt = require("express-jwt");

const keys = require("../../config/keys");

const graph = require("fbgraph");

require("../../config/passport")();

const authenticate = expressJwt({
  secret: keys.secretOrKey,
  requestProperty: "auth",
  getToken: function(req) {
    if (req.headers["authorization"]) {
      return req.headers["authorization"];
    }
    return null;
  }
});

/**
* @swagger
* tags:
*   name: Módulo de Autenticação
*   description: Módulo com endpoints relacionados à autenticação na API via rede social
*/


/**
* @swagger
* path:
*  /api/facebook/:
*    post:
*      summary: Realiza autenticação do usuário usando o Facebook
*      tags: [Módulo de Autenticação]
*      responses:
*        "200":
*          description: Retorna token de acesso a API mediante a autenticação feita via Facebook
*/
router.post(
  "/facebook",
  (req, res, next) => {
    passport.authenticate("facebook-token", { session: false })(req, res, next);
  },
  (req, res, next) => {
    if (!req.user) {
      return res.send(401, "User Not Authenticated");
    }
    req.auth = {
      id: req.user.provider_id,
      firstName: req.user.first_name,
      photo: req.user.photo,
      respostas: req.user.respostas
    };
    next();
  },
  generateToken,
  sendToken
);

/**
* @swagger
* path:
*  /api/google/:
*    post:
*      summary: Realiza autenticação do usuário usando o Google.
*      tags: [Módulo de Autenticação]
*      responses:
*        "200":
*          description: Retorna token de acesso a API mediante a autenticação feita via Google.
*/
router.post(
  "/google",
  (req, res, next) => {
    passport.authenticate("google-token", { session: false })(req, res, next);
  },
  (req, res, next) => {
    if (!req.user) {
      return res.send(401, "User Not Authenticated");
    }
    req.auth = {
      id: req.user.provider_id,
      firstName: req.user.first_name,
      photo: req.user.photo,
      respostas: req.user.respostas
    };

    next();
  },
  generateToken,
  sendToken
);

/**
* @swagger
* path:
*  /api/test/:
*    get:
*      summary: Testa se a autenticação do usuário funcionou.
*      tags: [Módulo de Autenticação]
*      responses:
*        "200":
*          description: Retorna mensagem confirmando que usuário está autenticado.
*/
router.get("/test", authenticate, (req, res) => {
  res.json({ msg: "Tudo certo" });
});

/**
* @swagger
* path:
*  /api/usingFacebookCode/:
*    get:
*      deprecated: true
*      summary: Reliza autenticação do usuário usando código do Facebook.
*      tags: [Módulo de Autenticação]
*      responses:
*        "200":
*          description: Retorna resposta do Facebook com informações do usuário autenticado.
*/
router.get("/usingFacebookCode", (req, res) => {
  graph.authorize(
    {
      client_id: keys.facebookAppID,      
      redirect_uri: keys.facebookRedirectURI,
      client_secret: keys.facebookAppSecret,
      code: req.query.code
    },
    function(err, facebookRes) {
      if (err) res.status(400).json(err);
      res.status(200).json(facebookRes);
    }
  );
});

module.exports = router;
