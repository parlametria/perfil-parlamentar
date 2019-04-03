const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const path = require("path");
const logger = require("heroku-logger");
const cors = require("cors");
const passport = require("passport");

const perguntas = require("./routes/api/perguntas");
const candidatos = require("./routes/api/candidatos");
const respostas = require("./routes/api/respostas");
const auth = require("./routes/api/auth");
const usuarios = require("./routes/api/usuarios");
const temas = require("./routes/api/temas");
const alinhamento = require("./routes/api/alinhamento");
const comissoes = require("./routes/api/comissoes");

const app = express();
var db = require("./models/index");

const corsOption = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  exposedHeaders: ["authorization"]
};
app.use(cors(corsOption));

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
app.use("/api/candidatos", candidatos);
app.use("/api/respostas", respostas);
app.use("/api/usuarios", usuarios);
app.use("/api/auth", auth);
app.use("/api/temas", temas);
app.use("/api/alinhamento", alinhamento);
app.use("/api/comissoes", comissoes);

// Set static folder
app.use(express.static("client/build"));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

const port = process.env.PORT || 5000;

app.listen(port, () => logger.info(`Servidor rodando na porta ${port}`));
