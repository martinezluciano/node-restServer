const express = require("express");
const app = express();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const _ = require("underscore");
const { checkToken, verifyToken } = require("../middlewares/authentification"); // pq usa {} ?

app.get("/usuario", checkToken, (req, res) => {
    let from = req.query.from || 0;
    let limit = req.query.limit || 5;
    from = Number(from);
    limit = Number(limit);

    User.find({}, "name email role estado google img") // " permite select campos"
        .skip(from)
        .limit(limit)
        .exec((err, users) => {
            if (err) {
                return res.status(400).json({ ok: false, err });
            }

            User.count({}, (err, count) => {
                if (err) {
                    return res.status(400).json({ ok: false, err });
                }
                res.json({ ok: true, users, quantity: count });
            });
        });
});

app.post("/usuario", checkToken, function(req, res) {
    let body = req.body;
    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });
    user.save((err, userDB) => {
        if (err) {
            return res.status(200).json({
                ok: false,
                err
            });
        } else {
            res.json({
                ok: true,
                user: userDB
            });
        }
    });
});

app.put("/usuario/:id", [checkToken, verifyToken], function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ["nombre", "email", "img", "role"]);
    User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userDB) => {
        if (err) {
            return res.status(400).json({ ok: false, error: err });
        }

        res.json({
            ok: true,
            user: userDB
        });
    });
});

app.delete("/usuario/:id", [checkToken, verifyToken], function(req, res) {
    let id = req.params.id;
    let changeEstado = { estado: false };
    User.findByIdAndUpdate(id, changeEstado, { new: true }, (err, usuario) => {
        if (err) {
            return res.status(400).json({ ok: false, err });
        }
        if (!usuario) {
            return res.status(400).json({ ok: false, message: "usuario no existe" });
        }
        res.json({ ok: true, usuario });
    });
    // User.findByIdAndRemove(id, (err, userRemoved) => {
    //     if (err) {
    //         return res.status(400).json({ ok: false, err });
    //     }
    //     if (!userRemoved) {
    //         return res.status(400).json({ ok: false, message: "usuario no existe" });
    //     }
    //     res.json({ ok: true, message: "user removed" + userRemoved });
    // });
});

module.exports = app;
