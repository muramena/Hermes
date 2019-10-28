const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const Schema = mongoose.Schema

let specialistSchema = new Schema({
    sector: {
        type: String,
        required: [true, 'El sector es necesario']
    },
    user: {
        type: Object,
        required: [true, 'El usuario especialista es necesario']
    },
    state: {
        type: Boolean,
        default: true
    }
})

specialistSchema.methods.toJSON = () => {

    let specialist = this;

    let specialistJSON = {
        sector: specialist.sector,
        state: specialist.state,
    }

    return specialistJSON;
}

specialistSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });

module.exports = mongoose.model('Specialist', specialistSchema);