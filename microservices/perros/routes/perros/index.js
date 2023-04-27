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
      data: data.dataLibrary.perros,
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
    data: perro, 
  }; 
 
  // Enviamos la respuesta 
  return res.send(response); 
});

//Creamos la ruta para obtener perros por el dueño
router.get("Dueno/:dueno", (req,res) =>{
  const dueno = data.dataLibrary.perros.filter((perro) =>{
    return perro.nombre_dueno.includes(req.params.dueno)
  });

  const response ={
    service: "perros",
    architecture: " microservicios",
    data: dueno
  };

  return res.send(response);
});

module.exports = router;