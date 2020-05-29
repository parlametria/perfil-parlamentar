const express = require("express");
const router = express.Router();
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Swagger set up
const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "API Perfil Parlamentar",
      version: "3.4.1",
      description:
        "Documentação da API do Perfil Parlamentar. Documentação construída usando como base o repositório de <a href='https://github.com/AlexanderKaran/Swagger-Time-to-document-that-API-you-built' target='_blank'>Alexander Karan</a>",
      license: {
        name: "MIT",
        url: "https://choosealicense.com/licenses/mit/"
      },
      contact: {
        name: "Perfil Parlamentar",
        url: "https://github.com/parlametria/perfil-parlamentar"
      }
    }
  },
  apis: ["./routes/api/*.js"]
};

const specs = swaggerJsdoc(options);
router.use("/docs", swaggerUi.serve);
router.get("/docs", swaggerUi.setup(specs, { explorer: true }));

module.exports = router;
