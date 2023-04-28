const express = require("express");

// Creamos un objeto Router
const router = express.Router();

const sqlite3 = require('sqlite3').verbose();
async function pruebaDB() {
const db = new sqlite3.Database('data/basePremios.db', (err) => { // inicio de la conecion
    if (err) {
      console.error(err.message);
    }
    console.log("Connected to the database.");
  }); // fin de la coneccion a db 
  const info = {};

  db.all("SELECT * FROM campeonatos", (err, rows) => { // ejecucion del query
    if (err) {
      console.error(err.message);
    }
    rows.forEach((row, index) => {
      info[index] = row;
    });
  }); // fin del query

  //Creamos el router para obtener todos los datos de la query
  router.get("/", (req, res) => {
    const response = {
      // crea una respuesta con información sobre los libros
      service: "premios",
      architecture: "microservices",
      length: info.length,
      data: info,
    };
    logger("Get premios data"); // registra un mensaje en los registros
    return res.json(response); // devuelve la respuesta al cliente
  });
}
pruebaDB();
module.exports = router;