const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema
/**
 * Creates sector Schema
 * ID - assigned by mongoDB
 * description
 * jefe
 */

 let sectorSchema = new Schema ({
     description: {
         type: String,
         unique: true,
         required: [true, 'La descripcion es necesaria']
     },
     jefe: {
         type: Object,
         required: [true, 'El jefe es necesario']
     }
 })

 sectorSchema.plugin(uniqueValidator, {message: '{PATH} debe ser único'});

 module.exports = mongoose.model('Sector', sectorSchema);
