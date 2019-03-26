require("./config/config");
const express = require("express");
const app = express();
var bodyParser = require("body-parser");
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//peticioness
app.get("/usuario", function(req, res) {
    res.json("get usuario");
});

app.post("/usuario", function(req, res) {
    let body = req.body;
    console.log("body :", body);
    console.log(body.nombre);
    if (body.Nombre === undefined) {
        console.log("entra");
        res.status(400).json({
            ok: "false",
            mensaje: "el nombre es necesario"
        });
    } else {
        res.json({ persona: body });
    }
});

app.put("/usuario/:id", function(req, res) {
    let id = req.params.id;
    res.json(id);
});

app.delete("/usuario", function(req, res) {
    res.json("delete usuario");
});

app.listen(process.env.PORT, () => {
    console.log("estuchando en puerto :", process.env.PORT);
});
