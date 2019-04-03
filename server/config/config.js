const port = process.env.PORT || 3000;

process.env.node_env = process.env.node_env || "dev";

let URLDB;

if (process.env.node_env === "dev") {
    URLDB = "mongodb://localhost:27017/coffee";
} else {
    URLDB = process.env.MONGO_URI;
}
process.env.URLDB = URLDB;

process.env.tokenExpire = 60 * 60 * 24 * 30;

process.env.seed = process.env.seed || "seed-Desarrollo";

// =================================
//    Google Client ID
// =================================
process.env.CLIENT_ID =
    process.env.CLIENT_ID ||
    "595401273747-rnaar1gjb993uk1auqv2cp2celj0brrt.apps.googleusercontent.com";

module.exports = port;
