const express = require("express");


// Creamos un objeto Router
const router = express.Router();

// Inportamos el Path de csvtojson
const path = require('path');
const csvPath = '../../data/raza_info.csv';
const directoryPath = path.join(__dirname, csvPath);
const csvtojson = require('csvtojson');

const RazaArray = [];

csvtojson({
    noheader: false

  })
  .fromFile(directoryPath)
  .then((jsonObject) => {
    for (let item in jsonObject) {
      let colors = jsonObject[item]['color_de_pelo'];
      if (colors.includes('Tricolor')) {
        colors = colors.replace(/Tricolor \(.*?\)(;|$)/gi, 'Tricolor (Negro, marrón y blanco)$1');
        colors = colors.split(';').map(color => color.trim());
      } else {
        colors = colors.split(';').map(color => color.trim());
      }

      jsonObject[item]['color_de_pelo'] = colors;
      RazaArray.push(jsonObject[item]);
    }
  });

// Creamos una función logger que muestra un mensaje en consola
const logger = (message) => console.log(`Razas: ${message}`);

router.get("/", (req, res) => {
  const response = {
    // crea una respuesta con información sobre los libros
    service: "Razas",
    architecture: "microservices",
    length: RazaArray.length,
    data: RazaArray,
  };
  logger("Get Razas data"); // registra un mensaje en los registros
  return res.json(response); // devuelve la respuesta al cliente
});

router.get("/raza/:raza", (req, res) => {
  const response = {
    // crea una respuesta con información sobre los libros
    service: "Razas",
    architecture: "microservices",
    length: RazaArray.length,
    data: RazaArray,
  };
  logger("Get Razas data"); // registra un mensaje en los registros
  return res.json(response); // devuelve la respuesta al cliente
});

// creamos un router para traer todos los perros dependiendo del pais de origen de la raza

router.get("/razas2/:PaisOrigen", async (req, res) => {
  const PaisOrigen = RazaArray.filter((raza) => raza.pais_de_origen === req.params.PaisOrigen);

  if (PaisOrigen.length === 0) {
    return res.status(404).send("Pais de origen no encontrado");
  }

  const ArrayPerro = {};
  for (let raza of PaisOrigen) {
    const perrosRespuesta = await fetch(`http://perros:3000/api/v3/perros/raza/${raza.raza}`);
    const perrosData = await perrosRespuesta.json();
    if(perrosData.data.length == 0){
      continue
    }
    const nombresPerros = [];
    for(let nombre of perrosData.data){
      nombresPerros.push(nombre.nombre_perro)
    } 
    ArrayPerro[raza.raza] = nombresPerros;
 }

  const response = {
    service: "Razas",
    architecture: "microservices",
    length: Object.keys(ArrayPerro).length,
    perros: ArrayPerro,
  };

  return res.json(response);
});

//Listar todas las razas donde tipo sea igual a "xxxx" y acreditado sea igual a "xxx"

router.get('/TipoRaza/:tipo/:acreditado', (req,res) => {
const tipo = req.params.tipo;
const acreditado = req.params.acreditado;
  const razas = RazaArray.filter((raza) =>{
    return raza.tipo == tipo && raza.acreditado === acreditado;
  });
  
  const response = {
    service: "Razas",
    architecture: "microservices",
    length: razas.length,
    razas: razas,
    };
  return res.json(response);
})

// segun el id de la raza listar la informacion de la raza y toda la informacion de los perros de esa raza

router.get("/razaID/:id", async (req, res) => {
  const razaID = RazaArray.filter((razaid) =>{
    return razaid.id == req.params.id
  });

  const ArrayPerro = {};
  for (let raza of razaID) {
    const perrosRespuesta = await fetch(`http://perros:3000/api/v3/perros/raza/${raza.raza}`);
    const perrosData = await perrosRespuesta.json();
    if(perrosData.data.length == 0){
      continue;      
    }
    const perros = [];
    for(let nombre of perrosData.data){
      perros.push(nombre)
    } 
    ArrayPerro[raza.raza] = perros;
 }
  // Creamos un objeto de respuesta con los datos de los autores
  const response = {
    service: "Perros",
    architecture: "microservices",
    length: razaID.length,
    raza: razaID,
    length: Object.keys(ArrayPerro).length,
    perros: ArrayPerro,
  };

  // Enviamos la respuesta
  return res.send(response);
});


module.exports = router;