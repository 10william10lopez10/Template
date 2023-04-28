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

// creamos un router para traer todos los perros dependiendo del pais de origen de la raza
/*router.get("/razas2/:PaisOrigen", async (req,res) =>{
  let PaisOrigen = null;
  for (let raza of Object.values(RazaArray)) {
    if (raza.pais_de_origen == req.params.PaisOrigen) {
      console.log(raza)
      PaisOrigen = raza;
      break;
    }
  }

  if (!PaisOrigen) {
    return res.status(404).send("Pais de origen no encontrado");
  }

  let PaisRespuesta = await fetch(`http://perros:3000/api/v3/perros/raza/${RazaArray.raza}`);
    const PaisData = await PaisRespuesta.json();
    const NombrePais = PaisData.data.map((perro) => perro.raza);

  const response = {
    // crea una respuesta con información sobre los libros
    service: "Razas",
    architecture: "microservices",
    length: PaisOrigen.length,
    PaisRaza: NombrePais,
    data: PaisOrigen,
  };
  return res.json(response); 
});*/
router.get("/razas2/:PaisOrigen", async (req, res) => {
  const PaisOrigen = RazaArray.filter((raza) => raza.pais_de_origen === req.params.PaisOrigen);

  if (PaisOrigen.length === 0) {
    return res.status(404).send("Pais de origen no encontrado");
  }

  const perrosRespuesta = await fetch(`http://perros:3000/api/v3/perros/Dueno/${req.params.PaisOrigen}`);
  const perrosData = await perrosRespuesta.json();
  const perros = perrosData.data.map((perro) => perro.raza);

  const response = {
    service: "Razas",
    architecture: "microservices",
    length: PaisOrigen.length,
    perros: perros,
    razas: PaisOrigen,
  };
  
  return res.json(response);
});


module.exports = router;