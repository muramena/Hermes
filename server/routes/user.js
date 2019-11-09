const express = require('express')
const user_controller = require('../controllers/user_controller')
const { check } = require('express-validator')

/**
 * express module
 */
var app = express()

/**
 * Gets all users from the DB.
 * @module user
 * @function
 * @param {String} path
 * @param {Function} callback 
 * @return {Object} - Status, users.
 */
app.get('/user', user_controller.user_all);

/**
 * Creates user and saves it in the DB.
 * @module user
 * @function
 * @param {String} path
 * @param {Function} callback 
 * @return {Object} - Status, user.
 */
app.post('/user', [
  check('firstName', 'Nombre es obligatorio').not().isEmpty(),
  check('lastName', 'Apellido es obligatorio').not().isEmpty(),
  check('dni', 'DNI debe contener al menos 7 caracteres').isLength({ min: 7 }),
  check('birthDate', 'Fecha de nacimiento es obligatorio').not().isEmpty(), //no hay control
  check('address', 'Direccion es obligatorio').not().isEmpty(),
  check('phone', 'Telefono es obligatorio').not().isEmpty(),  //no hay control
  check('email', 'Email no valido').isEmail(),
  check('username', 'Usuario debe contener al menos 4 caracteres').isLength({ min: 4 }),
  check('password', 'Contraseña debe contener al menos 8 caracteres').isLength({ min: 8 })
], user_controller.user_create)

/**
 * Get a user from the DB.
 * @module user
 * @function
 * @param {String} path
 * @param {Function} callback 
 * @return {Object} - Status, user.
 */
app.get('/user/:id', user_controller.user_details);

/**
 * Update a user from the DB by ID.
 * @module user
 * @function
 * @param {String} path
 * @param {Function} callback 
 * @return {Object} - Status, user.
 */
app.put('/user/update/:id', user_controller.user_update_by_id);

/**
 * Delete a user from the DB by ID.
 * @module user
 * @function
 * @param {String} path
 * @param {Function} callback 
 * @return {Object} - Status, user.
 */
app.put('/user/delete/:id', user_controller.user_delete_by_id);

module.exports = app;