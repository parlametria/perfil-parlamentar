const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const compression = require('compression')

const perguntas = require("./routes/api/perguntas");
const candidatos = require("./routes/api/candidatos");
const respostas = require("./routes/api/respostas");

const app = express();

app.use(compression)

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log("Banco de dados conectado!"))
  .catch(err => console.log(err));

// Usar as rotas
app.use("/api/perguntas", perguntas);
app.use("/api/candidatos", candidatos);
app.use("/api/respostas", respostas);

// Server static assets if in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
