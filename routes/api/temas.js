const express = require("express");
const router = express.Router();

const models = require("../../models/index");

const Tema = models.tema;

const BAD_REQUEST = 400;
const SUCCESS = 200;

/**
* @swagger
* tags:
*   name: Temas
*   description: Recupera lista de temas usados no Perfil Parlamentar
*/

/**
* @swagger
* path:
*  /api/temas/:
*    get:
*      summary: Recupera lista de temas das proposições do Perfil Parlamentar
*      tags: [Temas]
*      responses:
*        "200":
*          description: Lista com temas usados no Perfil
*/
router.get("/", (req, res) => {
  Tema.findAll({
    attributes: [["id_tema", "idTema"], "tema", "slug"],
    where: { ativo: true }
  })
  .then(temas => res.status(SUCCESS).json(temas))
  .catch(err => res.status(BAD_REQUEST).json({ err }));
});

module.exports = router;
