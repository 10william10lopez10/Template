const express = require("express");


// Creamos un objeto Router
const router = express.Router();

// Inportamos el Path de csvtojson
/*const path = require('path');
const csvPath = '../../data/raza_info.csv';
const directoryPath = path.join(__dirname, csvPath);
console.log(directoryPath);
const csvtojson = require('csvtojson');

const RazaArray = [];

csvtojson({
    noheader: false

  })
  .fromFile(directoryPath)
  .then((jsonObject) => {
    
    for (let items in jsonObject) {
        jsonObject[items]['color_de_pelo'] = jsonObject[items]['color_de_pelo'].split(";");
  
        RazaArray.push(jsonObject[items]);
      }
  });*/


  async function getData() {
    const csvPath = `${__dirname}../../data/raza_info.csv`;

    const RazaArray = await csvtojson({
      headers : true,
      colParser:{
        razas: function (item){
          const razas = item.split("; ");
          return razas;
        },
      },
    }).fromFile(csvPath);
    return RazaArray;
  }

  console.log(getData);
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

module.exports = router;