const port = require("./config/config");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
var bodyParser = require("body-parser");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

// usar rutas (CONFIGURACION GLOBAL)
app.use(require("./routes/index"));

// habilitar carpeta public para poder ser accedida
app.use(express.static(path.resolve(__dirname, "../public")));

// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});

mongoose.set("useCreateIndex", true);
mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true }, (err, res) => {
    if (err) throw err;
    console.log("BD online");
});

app.listen(port, () => {
    console.log("estuchando en puerto :", port);
});
