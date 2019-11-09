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
 * Authenticates user, verifying if email and password requirements are accomplished.
 */
app.post('/login', [
  check('username', 'Usuario demasiado corto o incompleto').isLength({ min: 4 }),
  check('password', 'Contraseña demasiado corta o incompleta').isLength({ min: 8 }) 
], user_controller.login)

module.exports = app;