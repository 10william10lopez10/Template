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
  const info = [];

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
    return res.json(response); // devuelve la respuesta al cliente
  });

  //Creamos un router para mostras los perros segun el lugar de su premio
  router.get("/Lugar/:lugar", async (req, res) => {
    const premio = info.filter((lugar) => {
      return lugar.lugar == req.params.lugar;
    });

    const response = {
      service: "premio",
      arquitectura: "microservicios",
      length: info.length,
      data: premio,
    };
    return res.send(response);
  });
  // crear campeones por el lugar 
  router.get("/NombreCampeon", async (req, res) => {
    console.log(req.query.lugar)
    const premio = info.filter((lugar) => {
      if (lugar.lugar == req.query.lugar) {
        const id = lugar.id_campeon
        return id
      }
    }).map((idCampeon) => {
      return idCampeon.id_campeon;
    });

    console.log(premio)


    const ArrayCampeones = [];
    for (let idCampeon of premio) {
      console.log(idCampeon)
      const perrosCampeon = await fetch(`http://perros:3000/api/v3/perros/perrosID/${idCampeon}`);
      const perrosData = await perrosCampeon.json();
      if(perrosData.data.length > 0) {
        ArrayCampeones.push(perrosData.data[0].nombre_perro)
      }
    }
    //const perrosChampios = perrosData.data.map((perro) => perro);

    const response = {
      service: "premio",
      arquitectura: "microservicios",
      length: ArrayCampeones.length,
      perrosCampeones: ArrayCampeones,
    };
    return res.send(response);
  })


   // crear campeones por el lugar con params 
   router.get("/NombreCampeon/:lugar", async (req, res) => {
    const premio = info.filter((lugar) => {
      if (lugar.lugar == req.params.lugar) {
        const id = lugar.id_campeon
        return id
      }
    }).map((idCampeon) => {
      return idCampeon.id_campeon;
    });

    console.log(premio)


    const ArrayCampeones = [];
    for (let idCampeon of premio) {
      console.log(idCampeon)
      const perrosCampeon = await fetch(`http://perros:3000/api/v3/perros/perrosID/${idCampeon}`);
      const perrosData = await perrosCampeon.json();
      if(perrosData.data.length > 0) {
        ArrayCampeones.push(perrosData.data[0].nombre_perro)
      }
    }
    //const perrosChampios = perrosData.data.map((perro) => perro);

    const response = {
      service: "premio",
      arquitectura: "microservicios",
      length: ArrayCampeones.length,
      perrosCampeones: ArrayCampeones,
    };
    return res.send(response);
  })

   //Creamos un router para mostras los perros segun el lugar de su premio
   router.get("/Puntuacion/:puntaje",(req, res) => {
    const Puntaje = info.filter((puntaje) => {
      return puntaje.puntaje == req.params.puntaje;
    });

    const response = {
      service: "premio",
      arquitectura: "microservicios",
      length: Puntaje.length,
      data: Puntaje,
    };
    return res.send(response);
  });
}
pruebaDB();
module.exports = router;