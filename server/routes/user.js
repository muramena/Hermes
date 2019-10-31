const express = require('express')
const db = require('mongoose');
const path = require('path')
const user_controller = require('../controllers/user_controller');
const { check, validationResult } = require('express-validator')

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
  check('firstName', 'nombre es obligatorio').not().isEmpty(),
  check('lastName', 'apellido es obligatorio').not().isEmpty(),
  check('dni', 'dni debe contener al menos 7 caracteres').isLength({ min: 7 }),
  check('birthDate', 'fecha de nacimiento es obligatorio').not().isEmpty(),
  check('address', 'direccion es obligatorio').not().isEmpty(),
  check('phone', 'telefono es obligatorio').not().isEmpty(),
  check('email', 'Invalid Email or Password').isEmail(),
  check('username', 'usuario debe contener al menos 4 caracteres').isLength({ min: 4 }),
  check('password', 'contraseña debe contener al menos 8 caracteres').isLength({ min: 8 }),
  check('confirmPassword', 'contraseña debe contener al menos 8 caracteres').isLength({ min: 8 }) //Verificar que sea igual a la password
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

/**
 * Get all tickets from a user by ID.
 * @module user
 * @function
 * @param {String} path
 * @param {Function} callback 
 * @return {Object} - Status, user.
 */
app.get('/user/tickets/:id', user_controller.user_tickets);

module.exports = app;