const express = require("express");
const data = require('../../data/datos_perro')

// Creamos un objeto Router
const router = express.Router();

// Creamos una función logger que muestra un mensaje en consola
const logger = (message) => console.log(`Perros: ${message}`);

router.get("/", (req, res) => {
  // Creamos un objeto de respuesta con los datos de los autores
  const response = {
    service: "Perros",
    architecture: "microservices",
    length: data.dataLibrary.perros.length,
    data: data.dataLibrary.perros,
  };

  // Enviamos la respuesta
  return res.send(response);
});

// devolver el promedio del peso donde la raza sea igual a "xxx"
router.get("/promedioRaza/:raza", (req, res) => {
  const perrosPorRaza = data.dataLibrary.perros.filter((perro) => {
    return perro.raza === req.params.raza;
  });

  if (perrosPorRaza.length === 0) {
    return res.status(404).send({
      message: "No se encontraron perros de la raza especificada"
    });
  }

  const promedioPeso = perrosPorRaza.reduce((acumulador, perro) => {
    return acumulador + perro.peso;
  }, 0) / perrosPorRaza.length;

  const response = {
    service: "Perros",
    architecture: "microservices",
    promedioPesoRaza: promedioPeso,
    perros: perrosPorRaza
  };

  return res.send(response);
});

router.get("/PerrosID/:id", (req, res) => {
  const PerrosID = data.dataLibrary.perros.filter((perroid) => {
    return perroid.Id == req.params.id
  });
  // Creamos un objeto de respuesta con los datos de los autores
  const response = {
    service: "Perros",
    architecture: "microservices",
    length: PerrosID.length,
    data: PerrosID,
  };

  // Enviamos la respuesta
  return res.send(response);
});

// Creamos la ruta para obtener perros por su ID o nombre del perro
router.get("/perro/:query", (req, res) => {
  // Verificamos si el parámetro es un número (ID) o una cadena (nombre de perro) 
  const id = Number(req.params.query);
  const name = req.params.query;

  let perro;

  if (!isNaN(id)) {
    // Si el parámetro es un número (ID), filtramos los perros por ID 
    perro = data.dataLibrary.perros.filter((perro) => {
      return id === perro.Id;
    });
  } else {
    // Si el parámetro es una cadena (nombre de autor), filtramos los perros por nombre 
    perro = data.dataLibrary.perros.filter((perro) => {
      return perro.nombre_perro.includes(name);
    });
  }

  // Creamos un objeto de respuesta con los datos de los autores 
  const response = {
    service: "Perros",
    architecture: "microservices",
    length: perro.length,
    data: perro,
  };

  // Enviamos la respuesta 
  return res.send(response);
});

//Creamos la ruta para obtener perros por el dueño
router.get("/Dueno/:dueno", (req, res) => {
  const dueno = data.dataLibrary.perros.filter((raza) => {
    return raza.pais_dueño ?.includes(req.params.dueno)
  });

  const response = {
    service: "perros",
    architecture: " microservicios",
    data: dueno,
  };

  return res.send(response);
});

//Creamos la ruta para obtener perros por la raza
router.get("/raza/:raza", (req, res) => {
  const perros = data.dataLibrary.perros.filter((raza) => {
    return raza.raza.includes(req.params.raza)
  });

  const response = {
    service: "perros",
    architecture: " microservicios",
    length: perros.length,
    data: perros,
  };

  return res.send(response);
});


// segun el pais de origen del dueño obtener la inf de los perros la inf de la raza de los perros y la inf de los campeonatos que ganaron esos perros
router.get("/paisDueno/:pais", async (req, res) => {
  const perros = data.dataLibrary.perros.filter((pais) => {
    return pais.pais_origen_dueno.includes(req.params.pais)
  });
  const razasPerro = [];
  for( let raza of perros){
    const razas = await fetch(`http://razas:5000/api/v3/razas/raza/${raza.raza}`);
    const perrosData = await razas.json();
    if(perrosData.data.raza === perros.raza){
      razasPerro.push(perrosData);
  }
}
  

  const response = {
    service: "perros",
    architecture: " microservicios",
    length: razasPerro.length,
    razasPerro: razasPerro,
    length: perros.length,
    perros: perros,

  };

  return res.send(response);
});
module.exports = router;