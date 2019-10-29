const mongoose = require('moongose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = moongose.Schema
/**
 * Creates sector Schema
 * ID - assigned by mongoDB
 * description
 * jefe
 */

 let sectorSchema = new Schema ({
     description: {
         type: String,
         required: [true, 'La descripcion es necesaria']
     },
     jefe: {
         type: Object,
         required: [true, 'El jefe es necesario']
     }
 })

 sectorSchema.plugin(uniqueValidator, {message: '{PATH} debe ser único'});

 module.exports = mongoose.model('Sector', sectorSchema);
