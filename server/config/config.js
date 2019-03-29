const port = process.env.PORT || 3000;
console.log(port);
process.env.node_env = process.env.node_env || "dev";

let URLDB;
if ((process.env.node_env = !"dev")) {
    URLDB = "mongodb://localhost:27017/coffee";
} else {
    URLDB = "mongodb+srv://merten:Guada2452@cluster0-oirh4.mongodb.net/test?retryWrites=true";
}

process.env.URLDB = URLDB;

module.exports = port;
