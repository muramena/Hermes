const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const Schema = mongoose.Schema

const validRoles = {
    values: [0, 1, 2],
    message: '{VALUE} no es un rol válido'
}

const validSector = {
    values: [0, 1, 2, 3],
    message: '{VALUE} no es un sector válido'
}

let specialistSchema = new Schema({
    sector: {
        type: Number,
        required: [true, 'El sector es necesario'],
        enum: validSector
    },
    username: {
        type: String,
        unique: true,
        required: [true, 'El usuario especialista es necesario']
    },
    rol: {
        type: Number,
        required: [true, 'Se necesita especificar el Rol de usuario'],
        enum: validRoles
    },
    state: {
        type: Boolean,
        default: true
    }
})

specialistSchema.methods.getRol = function () {

    let specialist = this;
    switch (specialist.rol){
        case 0:
            return 'Especialista'
        case 1:
            return 'Jefe de sector'
        case 2:
            return 'Jefe de área'
    }
    return 'Error';
}

specialistSchema.methods.getSector = function () {

    let specialist = this;
    switch (specialist.sector){
        case 0:
            return 'Desarrollo'
        case 1:
            return 'Comunicaciones'
        case 2:
            return 'Soporte'
        case 3:
            return 'Es jefe de área'
    }
    return 'Error';
}

specialistSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });

module.exports = mongoose.model('Specialist', specialistSchema);