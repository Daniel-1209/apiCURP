const { render } = require("ejs");
let fetch = require("node-fetch");
const { send } = require("process");

let cherio = require("cheerio");

const { profile } = require("console");
const fs = require('fs');
const path = require("path");


const dateUsersPath = path.join(__dirname, "../date/dateUsers.json");
const dateUsers = JSON.parse(fs.readFileSync(dateUsersPath, 'utf-8'));






let controller = {
  form: (req, res) => {
    res.render("form", { title: "Formulario" });
  },
  found: (req, res) => {
    let curp = req.body.curp;


    fetch("http://renapo.sep.gob.mx/wsrenapo/MainControllerParam", {
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-language":
          "es-419,es;q=0.9,en-US;q=0.8,en;q=0.7,zh-CN;q=0.6,zh;q=0.5,ja;q=0.4,zh-TW;q=0.3,de;q=0.2",
        "cache-control": "max-age=0",
        "content-type": "application/x-www-form-urlencoded",
        "upgrade-insecure-requests": "1",
      },
      referrer: "http://renapo.sep.gob.mx/wsrenapo/",
      referrerPolicy: "strict-origin-when-cross-origin",
      body: "curp=" + curp + "&Submit=Enviar",
      method: "POST",
      mode: "cors",
      credentials: "include",
    })
      .then((datosUno) => datosUno.text())
      .then((datosBase) => {

        const $ = cherio.load(datosBase);
        
        let recabandoDatos = [];
        let user = new Object();

        let datosUsuario = ['AnioReg:', 'Apellido1:', 'Apellido2:','CURP:', 'FechNac:', 'Nacionalidad:', 'Nombres:', 'NumActa:', 'NumEntidadReg:', 'Sexo:', 'StatusCurp:'  ];

        // Bucle a través de  todas las tablas
        let $rows = $("tbody tr").each(function(index) {
          $cells = $(this).find("td");

          $cells.each(function(cellIndex) {
          
            // Insertando cada texto en el arreglo
          recabandoDatos.push ( $(this).text());

          });    
        });

        for( propieda of datosUsuario){
          for ( let i = 0; i < recabandoDatos.length; i++){
            if( propieda === recabandoDatos[i]) {
              user[propieda] = recabandoDatos[(i+1)];
              break;
            }
          }
          
        }

        // Agregando el usuario y escribiendolo en el archivo json
        
        dateUsers.push(user);

        console.log(recabandoDatos);

        fs.writeFileSync(dateUsersPath,  JSON.stringify(dateUsers));

        //console.log(user);
        
      });

      //let newDate = JSON.stringify(documento);
      


      res.render("form", { title: "Formulario" });
      //res.render('userList.html');

     
    /*
    .then(datosBase => {
      //fs.appendFileSync(logPath, datosBase, 'utf8');
      //documento = JSON.parse( datosBase);
      //res.send(documento)
      //console.log(datosBase);
      documento = datosBase;

      //res.render(newDatos);
    });

    let newDate = JSON.stringify(documento);
    //fs.appendFileSync(logPath, newDate, 'utf8');
    res.send(documento);
    console.log(newDate);

    */
  },
};

module.exports = controller;
