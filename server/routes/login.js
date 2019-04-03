const express = require("express");
const app = express();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIEND_ID);

app.post("/login", (req, res) => {
    let body = req.body;

    User.findOne({ email: body.email }, (err, userBD) => {
        if (err) {
            return res.json({ ok: false, message: err });
        }
        if (!userBD) {
            return res.status(500).json({
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

// CONFIGURACION DE GOOGLE

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID
        // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    };
}
app.post("/google", async (req, res) => {
    let token = req.body.idtoken;
    let googleUser = await verify(token).catch(err => {
        return res.status(403).json({ ok: false, message: err });
    });

    User.findOne({ email: googleUser.email }, (err, userBD) => {
        if (err) {
            return res.status(500).json({ ok: false, message: err });
        }
        if (userBD) {
            // si el user ya se registro en la web
            if (userBD.google === false) {
                return res.status(400).json({
                    ok: false,
                    message: "Debe de usar su autentificacion normal"
                });
            } else {
                let token = jwt.sign({ user: userBD }, process.env.seed, {
                    expiresIn: process.env.tokenExpire
                });
                return res.json({
                    ok: true,
                    user: userBD,
                    token
                });
            }
        } else {
            // si el user no existe en nuestra base de datos
            console.log("user no existe en nuestra base de datos");
            let user = new User();

            user.name = googleUser.nombre;
            user.email = googleUser.email;
            user.img = googleUser.img;
            user.google = true;
            user.password = ":)";

            user.save((err, userBD) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: err
                    });
                } else {
                    let token = jwt.sign({ user: userBD }, process.env.seed, {
                        expiresIn: process.env.tokenExpire
                    });
                    return res.json({
                        ok: true,
                        user: userBD,
                        token
                    });
                }
            });
        }
    });
});

module.exports = app;
