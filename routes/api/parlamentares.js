const express = require("express");
const Sequelize = require("sequelize");

const router = express.Router();

const Op = Sequelize.Op;

const models = require("../../models/index");
//const Candidato = models.candidato;

const Parlamentar = models.parlamentar;
const Votacao = models.votacao;
const Proposicao = models.proposicao;

const BAD_REQUEST = 400;
const SUCCESS = 200;

/**
 * Recupera informações do mapeamento ID do parlamentar e CPF
 * @name get/api/parlamentares
 * @function
 * @memberof module:routes/parlamentares
 */
router.get("/mapeamento-cpf", (req, res) => {
  Candidato
    .findAll({
      attributes: ["cpf", "id_parlamentar"],
      where: {
        id_parlamentar: {
          [Op.ne]: null
        }
      }
    })
    .then(candidatos => res.status(SUCCESS).json(candidatos))
    .catch(err => res.status(BAD_REQUEST).json({ err: err.message }));
});

router.get("/parlamentar", (req, res) => {
  // Parlamentar
  //   .findAll({
  //     include: [
  //       {
  //         model: Votacao,
  //         attributes: ["id_parlamentar_voz", "id_votacao", "voto"],
  //         as: "parlamentar_vot",          
  //         required: false,
  //         include: {
  //           model: Proposicao,
  //           attributes: ["id_votacao", "titulo", "projeto_lei"],
  //           as: "vot_prop",
  //           required: false
  //         }
  //       }
  //     ]
  //   })
  Proposicao
    .findAll({      
      include: [
        {
        model: Votacao,        
        attributes: ["id_votacao", "id_parlamentar_voz", "voto"],
        as: "vot_prop",
        required: false,
        }
      ]
    })
    .then(parlamentares => {
      res.status(SUCCESS).json(parlamentares);
    })
    .catch(err => res.status(BAD_REQUEST).json({ err: err.message }));
});

module.exports = router;