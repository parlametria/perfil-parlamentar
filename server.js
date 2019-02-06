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

const app = express();
var db2 = require("./models");

const corsOption = {
  origin: "http://localhost:4200",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  exposedHeaders: ["authorization"]
};
app.use(cors(corsOption));

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(bodyParser.json());

db2.sequelize.sync().then(function() {
  http.createServer(app).listen(app.get("port"), function() {
    console.log("Express server listening on port " + app.get("port"));
  });
});

// Usar as rotas
app.use("/api/perguntas", perguntas);
app.use("/api/candidatos", candidatos);
app.use("/api/respostas", respostas);
app.use("/api/usuarios", usuarios);
app.use("/api/auth", auth);

// Set static folder
app.use(express.static("client/build"));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

const port = process.env.PORT || 5000;

app.listen(port, () => logger.info(`Servidor rodando na porta ${port}`));
