const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const path = require("path");
const logger = require("heroku-logger");
const cors = require("cors");
const passport = require("passport");
const compression = require("compression");
const forceSsl = require('force-ssl-heroku');

const perguntas = require("./server/routes/api/perguntas");
const auth = require("./server/routes/api/auth");
const usuarios = require("./server/routes/api/usuarios");
const temas = require("./server/routes/api/temas");
const alinhamento = require("./server/routes/api/alinhamento");
const comissoes = require("./server/routes/api/comissoes");
const parlamentares = require("./server/routes/api/parlamentares");
const aderencia = require("./server/routes/api/aderencia");
const orientacoes = require("./server/routes/api/orientacoes");
const liderancas = require("./server/routes/api/liderancas");
const perfil = require("./server/routes/api/perfil");
const investimentoPartidario = require("./server/routes/api/investimentoPartidario");
const buscaParlamentar = require("./server/routes/api/busca-parlamentar");
const votacoes = require("./server/routes/api/votacoes");
const swagger = require("./server/routes/api/swagger");

const app = express();
app.use(forceSsl);

app.use(compression());
var db = require("./server/models/index");

const corsOptions = {
  origin: [
    /localhost:.*/,
    /.*\.parlametria\.org\.br$/
  ],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["authorization"]
};
app.use(cors(corsOptions));

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(bodyParser.json());

// Testa conexão com o BD
db.sequelize
  .authenticate()
  .then(() => {
    logger.info("Conexão com BD estabelecida com sucesso.");
  })
  .catch(err => {
    logger.error("Não foi possível conectar com o BD: ", err);
  });

// Usar as rotas
app.use("/api/perguntas", perguntas);
app.use("/api/usuarios", usuarios);
app.use("/api/auth", auth);
app.use("/api/temas", temas);
app.use("/api/alinhamento", alinhamento);
app.use("/api/comissoes", comissoes);
app.use("/api/parlamentares", parlamentares);
app.use("/api/aderencia", aderencia);
app.use("/api/orientacoes", orientacoes);
app.use("/api/liderancas", liderancas);
app.use("/api/perfil", perfil);
app.use("/api/investimento", investimentoPartidario);
app.use("/api/busca-parlamentar", buscaParlamentar);
app.use("/api/votacoes", votacoes);
app.use("/api/swagger", swagger);


// Set static folder
app.use(express.static("client/build"));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

const port = process.env.PORT || 5000;

app.listen(port, () => logger.info(`Servidor rodando na porta ${port}`));
