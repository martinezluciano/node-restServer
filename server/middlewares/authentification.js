const jwt = require("jsonwebtoken");

let checkToken = (req, res, next) => {
    let token = req.get("authorization");

    jwt.verify(token, process.env.seed, (err, decoded) => {
        if (err) {
            return res.status(401).json({ ok: false, message: "Token no valido" });
        }

        req.usuario = decoded.user;
        next();
    });
};

let verifyToken = (req, res, next) => {
    console.log("req.usuario.role :", req.usuario.role);
    if (req.usuario.role === "ADMIN_ROLE") {
        console.log("entra ");
        next();
    } else {
        return res.status(401).json({ ok: false, message: "USER no ADMIN" });
    }
};

module.exports = {
    checkToken,
    verifyToken
};
