const express = require("express");

const router = express.Router();

const models = require("../../models/index");
const PerfilMais = models.perfilMais;
const Parlamentar = models.parlamentar;
const Aderencia = models.aderencia;
const Partido = models.partido;
const Tema = models.tema;

const BAD_REQUEST = 400;
const SUCCESS = 200;

const attPerfil = [["id_parlamentar_voz", "idParlamentarVoz"], ["peso_politico", "pesoPolitico"]]
const attParlamentar = [["nome_eleitoral", "nomeEleitoral"], "casa"]
const attAderencia = ["faltou", ["partido_liberou", "partidoLiberou"], ["nao_seguiu", "naoSeguiu"], "seguiu", "aderencia"];
const attPartido = [["id_partido", "idPartido"], "sigla"]
const attTema = [["id_tema", "idTema"], "tema", "slug"]

/**
* @swagger
* tags:
*   name: Perfil (índices)
*   description: Módulo de recuperação dos índices calculados para o perfil dos parlamentares.
*/

/**
* @swagger
* path:
*  /api/perfil/lista:
*    get:
*      summary: Recupera o peso político para todos os parlamentares.
*      tags: [Perfil (índices)]
*      responses:
*        "200":
*          description: Informações dos pesos políticos de todos os parlamentares.
*/
router.get("/lista", (req, res) => {
  PerfilMais.findAll({
    attributes: attPerfil
  })
    .then(parlamentares => res.status(SUCCESS).json(parlamentares))
    .catch(err => res.status(BAD_REQUEST).json({ err }));
});

/**
* @swagger
* path:
*  /api/perfil/peso/{id}:
*    get:
*      summary: Recupera o peso político para um parlamentar específico.
*      tags: [Perfil (índices)]
*      parameters:
*        - in: path
*          name: id
*          schema:
*            type: integer
*          required: true
*          description: Id do parlamentar
*      responses:
*        "200":
*          description: Informações do peso político para um parlamentar específico.
*/
router.get("/peso/:id", (req, res) => {
  PerfilMais.findAll({
    attributes: attPerfil,
    where: {
      id_parlamentar_voz: req.params.id
    }
  })
    .then(parlamentares => res.status(SUCCESS).json(parlamentares))
    .catch(err => res.status(BAD_REQUEST).json({ err }));
});

/**
* @swagger
* path:
*  /api/perfil/{id}:
*    get:
*      summary: Recupera índices calculados para um parlamentar e também a aderência em votações nominais.
*      tags: [Perfil (índices)]
*      parameters:
*        - in: path
*          name: id
*          schema:
*            type: integer
*          required: true
*          description: Id do parlamentar
*      responses:
*        "200":
*          description: Informações dos índices calculados para o parlamentar e seus dados de aderência em votações.
*/
router.get("/:id", (req, res) => {
  PerfilMais.findOne({
    attributes: attPerfil,
    include: [
      {
        attributes: attParlamentar,
        model: Parlamentar,
        as: "perfilMaisParlamentar",
        include: [
          {
            attributes: attAderencia,
            model: Aderencia,
            as: "parlamentarAderencia",
            required: false,
            include: [
              {
                attributes: attPartido,
                model: Partido,
                as: "partido",
                required: false,
              },
              {
                attributes: attTema,
                model: Tema,
                as: "aderenciaTema",
                required: false
              }
            ]
          }
        ]
      }
    ],
    where: {
      id_parlamentar_voz: req.params.id
    }
  })
    .then(parlamentar => res.status(SUCCESS).json(parlamentar))
    .catch(err => res.status(BAD_REQUEST).json({ err }));
});

/**
* @swagger
* path:
*  /api/perfil/lista:
*    post:
*      summary: Recupera informações de uma lista de parlamentares e seus índices (incluindo aderência por tema) a partir de uma lista de ID's 
*               passada no corpo da requisição.
*      tags: [Perfil (índices)]
*      requestBody:
*        description: Objeto com lista de parlamentares para pesquisa dos índices.
*        required: true
*        content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               parlamentares:
*                 type: array
*             example:
*               parlamentares: ["1160508", "1136811"]
*      responses:
*        "200":
*          description: Informações dos índices calculados para o parlamentar e seus dados de aderência em votações.
*/
router.post("/lista", (req, res) => {

  console.log(req.body.parlamentares);

  PerfilMais.findAll({
    attributes: attPerfil,
    include: [
      {
        attributes: attParlamentar,
        model: Parlamentar,
        as: "perfilMaisParlamentar",
        include: [
          {
            attributes: attAderencia,
            model: Aderencia,
            as: "parlamentarAderencia",
            required: false,
            include: [
              {
                attributes: attPartido,
                model: Partido,
                as: "partido",
                required: false,
              },
              {
                attributes: attTema,
                model: Tema,
                as: "aderenciaTema",
                required: false
              }
            ]
          }
        ]
      }
    ],
    where: {
      id_parlamentar_voz: req.body.parlamentares
    }
  })
    .then(parlamentares => res.status(SUCCESS).json(parlamentares))
    .catch(err => res.status(BAD_REQUEST).json({ err }));
});

module.exports = router;
