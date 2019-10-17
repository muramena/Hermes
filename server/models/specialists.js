const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const Schema = mongoose.Schema

let specialistSchema = new Schema({
    userID: {
        type: String,
        trim: true,
        required: [true, 'El Id del usuario es necesario']
    },
    sector: {
        type: String,
        required: [true, 'El sector es obligatorio']
    },
    state: {
        type: Boolean,
        default: true
    }
})

specialistSchema.methods.toJSON = () => {

    let specialist = this;

    let specialistJSON = {
        userID: specialist.userID,
        sector: specialist.sector,
        state: specialist.state,
    }

    return specialistJSON;
}

specialistSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });

module.exports = mongoose.model('Specialist', specialistSchema);