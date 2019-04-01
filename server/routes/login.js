const express = require("express");
const app = express();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

app.post("/login", (req, res) => {
    let body = req.body;

    User.findOne({ email: body.email }, (err, userBD) => {
        if (err) {
            return res.json({ ok: false, message: err });
        }
        if (!userBD) {
            return res.status(401).json({
                ok: false,
                message: "User no existe"
            });
        }

        if (!bcrypt.compareSync(body.password, userBD.password)) {
            return res.json({
                ok: false,
                message: "Password incorrecto"
            });
        }
        let token = jwt.sign({ user: userBD }, process.env.seed, {
            expiresIn: process.env.tokenExpire
        });
        res.json({
            ok: true,
            User: userBD,
            token
        });
    });
});

module.exports = app;
