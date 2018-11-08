const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const logger = require("heroku-logger");
const http = require("http");

const perguntas = require("./routes/api/perguntas");
const candidatos = require("./routes/api/candidatos");
const respostas = require("./routes/api/respostas");

const app = express();
var db2 = require("./models");

// app.use(compression())

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB Config
const db = require("./config/keys").mongoURI;

db2.sequelize.sync().then(function() {
  http.createServer(app).listen(app.get("port"), function() {
    console.log("Express server listening on port " + app.get("port"));
  });
});

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => logger.info("Banco de dados conectado!"))
  .catch(err => logger.error(err));

// Usar as rotas
app.use("/api/perguntas", perguntas);
app.use("/api/candidatos", candidatos);
app.use("/api/respostas", respostas);

// Set static folder
app.use(express.static("client/build"));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

const port = process.env.PORT || 5000;

app.listen(port, () => logger.info(`Servidor rodando na porta ${port}`));
