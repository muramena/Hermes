const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const Schema = mongoose.Schema

let userSchema = new Schema({
    username: {
        type: String,
        trim: true,
        required: [true, 'El nombre de usuario es necesario']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    firstName: {
        type: String,
        trim: true,
        required: [true, 'El nombre es necesario']
    },
    lastName: {
        type: String,
        trim: true,
        required: [true, 'El apellido es necesario']
    },
    dni: { //FALTA CONTROLAR NUMEROS Y LETRAS
        type: Number,
        required: [true, 'El DNI es necesario'],
        validate: {
            validator: Number.isInteger,
            message: 'DNI no es un numero'
        }
    },
    birthDate: { //FALTA CONTROLAR NUMEROS Y LETRAS
        type: String,
        required: [true, 'La fecha de nacimiento es necesaria']
    },
    address: { //DEBERIA NORMALIZARCE
        type: String,
        trim: true,
        required: [true, 'La dirección es necesaria']
    },
    phone: { //FALTA VALIDAR
        type: String,
        required: [true, 'El telefono es necesario']
    },
    state: {
        type: Boolean,
        default: true
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        required: [true, 'El email es necesario']
    }
})

userSchema.methods.toJSON = () => {

    let user = this;

    let userJSON = {
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
        address: user.address,
        phone: user.phone,
        img: user.img
    }

    /* console.log(user);
    console.log(userJSON); */

    return userJSON;
}

console.log('modelo user')

userSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });

module.exports = mongoose.model('User', userSchema);