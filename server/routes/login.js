const express = require('express')
const db = require('mongoose');
const path = require('path')
const login_controller = require('../controllers/login_controller');
const { check, validationResult } = require('express-validator')

/**
 * express module
 */
var app = express()

app.post('/login', [
    check('email', 'Invalid Email or Password').isEmail(),
    check('password', 'Invalid Email or Password').isLength({ min: 5 }) //Esta devolviendo los dos errores, corregir.
  ], login_controller.login);

module.exports = app;