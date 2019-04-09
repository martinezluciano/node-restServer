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
