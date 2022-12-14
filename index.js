const express = require("express");
const { Client, ClientBase } = require("pg");
const cors = require("cors");
const bodyparser = require("body-parser");
const config = require("./config");

const app = express();

//middleware
app.use(express.json());
app.use(cors());
app.use(bodyparser.json());
/***********/

var conString = config.urlConnection;
var client = new Client(conString);

client.connect(function (err) {
  if (err) {
    return console.error("Não foi possível conectar ao banco.", err);
  }
  client.query("SELECT NOW()", function (err, result) {
    if (err) {
      return console.error("Erro ao executar a query.", err);
    }
    console.log(result.rows[0]);
  });
});

//ROTAS
app.get("/", (req, res) => {
  console.log("Response ok.");
  res.send("Ok - Servidor disponível");
});

//GET USERS
app.get("/usuarios", (req, res) => {
  try {
    client.query("SELECT * FROM Usuarios", function (err, result) {
      if (err) {
        return console.error("Erro ao executar a qry de SELECT", err);
      }
      res.send(result.rows);
      console.log("Chamou get usuarios");
    });
  } catch (error) {
    console.log(error);
  }
});

//GET EQUIPES
app.get("/equipes", (req, res) => {
  try {
    client.query("SELECT * FROM Equipes", function (err, result) {
      if (err) {
        return console.error("Erro ao executar a qry de SELECT", err);
      }
      res.send(result.rows);
      console.log("Chamou get equipes");
    });
  } catch (error) {
    console.log(error);
  }
});

//GET USERS BY ID
app.get("/usuarios/:id", (req, res) => {
  try {
    console.log("Chamou /:id " + req.params.id);
    client.query(
      "SELECT * FROM Usuarios WHERE id = $1",
      [req.params.id],
      function (err, result) {
        if (err) {
          return console.error("Erro ao executar a qry do SELECT", err);
        }
        res.send(result.rows);
        console.log(result);
      }
    );
  } catch (error) {
    console.log(error);
  }
});

//GET EQUIPES BY ID
app.get("/equipes/:id", (req, res) => {
  try {
    console.log("Chamou /:id " + req.params.id);
    client.query(
      "SELECT * FROM Equipes WHERE id = $1",
      [req.params.id],
      function (err, result) {
        if (err) {
          return console.error("Erro ao executar a qry do SELECT", err);
        }
        res.send(result.rows);
        console.log(result);
      }
    );
  } catch (error) {
    console.log(error);
  }
});

//DELETE USERS BY ID
app.delete("/usuarios/:id", (req, res) => {
  try {
    console.log("Chamou delete /:id " + req.params.id);
    const id = req.params.id;
    client.query(
      "DELETE FROM Usuarios WHERE id = $1",
      [id],
      function (err, result) {
        if (err) {
          return console.error("Erro ao executar a qry de DELETE", err);
        } else {
          if (result.rowCount == 0) {
            res.status(400).json({ info: "Registro não encontrado." });
          } else {
            res.status(200).json({ info: `Registro excluído. Código: ${id}` });
          }
        }
        console.log(result);
      }
    );
  } catch (error) {
    console.log(error);
  }
});

//DELETE EQUIPES BY ID
app.delete("/equipes/:id", (req, res) => {
  try {
    console.log("Chamou delete /:id " + req.params.id);
    const id = req.params.id;
    client.query(
      "DELETE FROM Equipes WHERE id = $1",
      [id],
      function (err, result) {
        if (err) {
          return console.error("Erro ao executar a qry de DELETE", err);
        } else {
          if (result.rowCount == 0) {
            res.status(400).json({ info: "Registro não encontrado." });
          } else {
            res.status(200).json({ info: `Registro excluído. Código: ${id}` });
          }
        }
        console.log(result);
      }
    );
  } catch (error) {
    console.log(error);
  }
});

//POST USERS
app.post("/usuarios", (req, res) => {
  try {
    console.log("Chamou post", req.body);
    const { nome, email } = req.body;
    client.query(
      "INSERT INTO Usuarios (nome, email) VALUES ($1, $2) RETURNING * ",
      [nome, email],
      function (err, result) {
        if (err) {
          return console.error("Erro ao executar a qry de INSERT", err);
        }
        const { id } = result.rows[0];
        res.setHeader("id", `${id}`);
        res.status(201).json(result.rows[0]);
        console.log(result);
      }
    );
  } catch (erro) {
    console.error(erro);
  }
});

//POST EQUIPES
app.post("/equipes", (req, res) => {
  try {
    console.log("Chamou post", req.body);
    const { nome, escudo } = req.body;
    client.query(
      "INSERT INTO Equipes (nome, escudo) VALUES ($1, $2) RETURNING * ",
      [nome, escudo],
      function (err, result) {
        if (err) {
          return console.error("Erro ao executar a qry de INSERT", err);
        }
        const { id } = result.rows[0];
        res.setHeader("id", `${id}`);
        res.status(201).json(result.rows[0]);
        console.log(result);
      }
    );
  } catch (erro) {
    console.error(erro);
  }
});

//UPDATE USERS
app.put("/usuarios/:id", (req, res) => {
  try {
    console.log("Chamou update", req.body);
    const id = req.params.id;
    const { nome, email } = req.body;
    client.query(
      "UPDATE Usuarios SET nome=$1, email=$2 WHERE id =$3 ",
      [nome, email, id],
      function (err, result) {
        if (err) {
          return console.error("Erro ao executar a qry de UPDATE", err);
        } else {
          res.setHeader("id", id);
          res.status(202).json({ id: id });
          console.log(result);
        }
      }
    );
  } catch (erro) {
    console.error(erro);
  }
});

//UPDATE EQUIPES
app.put("/equipes/:id", (req, res) => {
  try {
    console.log("Chamou update", req.body);
    const id = req.params.id;
    const { nome, escudo } = req.body;
    client.query(
      "UPDATE Equipes SET nome=$1, escudo=$2 WHERE id =$3 ",
      [nome, escudo, id],
      function (err, result) {
        if (err) {
          return console.error("Erro ao executar a qry de UPDATE", err);
        } else {
          res.setHeader("id", id);
          res.status(202).json({ id: id });
          console.log(result);
        }
      }
    );
  } catch (erro) {
    console.error(erro);
  }
});

/*******/
app.listen(config.port, () =>
  console.log("Servidor funcionando na porta " + config.port)
);

module.exports = app; 
