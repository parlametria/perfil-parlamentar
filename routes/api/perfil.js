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
 * Recupera informações de um parlamentar e seus índices (incluindo aderência por tema) a partir de seu ID no Voz Ativa
 * 
 * @name get/api/perfil/:id
 * @function
 * @memberof module:routes/perfil
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
 * Recupera informações de uma lista de parlamentares e seus índices (incluindo aderência por tema) a partir de uma lista de ID's 
 * passada no corpo da requisição. Exemplo: { "parlamentares": ["1160508", "1136811"] }
 * 
 * @name get/api/perfil/lista
 * @function
 * @memberof module:routes/perfil
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
