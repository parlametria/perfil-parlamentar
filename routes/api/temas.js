/** Express router
 * @module routes/temas
 * @requires express
 */
const express = require("express");
const models = require("../../models/index");

const Tema = models.tema;

/**
 * Rotas para funções relacionadas aos temas.
 * @namespace module:routes/temas
 */
const router = express.Router();

//const Tema = "./postgres/tema";
const BAD_REQUEST = 400;
const SUCCESS = 200;

/**
 * Pega todas os temas.
 * @name get/api/temas
 * @function
 * @memberof module:routes/temas
 */
router.get("/", (req, res) => {
    Tema.findAll().then((temas, err) => {
    let response;
    response = err
        ? { status: BAD_REQUEST, message: "Error fetching data" }
        : {
            data: temas,
            status: SUCCESS
        };
      res.status(response.status).json(response);
    });
});

module.exports = router;
