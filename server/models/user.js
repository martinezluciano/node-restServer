const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

let Schema = mongoose.Schema;

let rolesValidos = {
    values: ["ADMIN_ROLE", "USER_ROLE"],
    message: "{VALUE} no es un rol Válido"
};

let userSchema = new Schema({
    username: {
        type: String,
        required: [true, "El nombre es necesario"]
    },
    nombre: {
        type: String,
        required: [true, "El nombre es necesario"]
    },
    apelllido: {
        type: String,
        required: [true, "El nombre es necesario"]
    },
    email: {
        type: String,
        required: [true, "El correo es necesario"],
        unique: true
    },
    password: {
        type: String,
        required: "La contraseña es obligatoria"
    },
    telefono: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: "USER_ROLE",
        enum: rolesValidos
    },
    estado: {
        type: String,
        required: false
    },
    id: {
        type: Boolean,
        default: false
    }
});

// Modifica el motodo toJSON cuando intenta imprimir, eliminando la password.
userSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
};

// para utilizar uniqueValidator en userSchema
userSchema.plugin(uniqueValidator, { message: "El {PATH} debe ser únicossssss" });

module.exports = mongoose.model("user", userSchema);
