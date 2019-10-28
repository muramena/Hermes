const express = require('express')
const db = require('mongoose');
const path = require('path')
const login_controller = require('../controllers/login_controller');
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
    check('email', 'Invalid Email or Password').isEmail(), //Deberia ser usuario segun la srs
    check('password', 'Invalid Email or Password').isLength({ min: 8 }) //Esta devolviendo los dos errores, corregir.
  ], login_controller.login);

  
/**
 * Registers a user.
 */
app.post('/register', [
  check('username', 'usuario debe contener al menos 4 caracteres').isEmpty().isLength({ min: 4 }),
  check('password', 'contraseña debe contener al menos 8 caracteres').isEmpty().isLength({ min: 8 }),
  check('confirmPassword', 'contraseña debe contener al menos 8 caracteres').isEmpty().isLength({ min: 8 }), //Verificar que sea igual a la password
  check('firstName', 'nombre es obligatorio').isEmpty(),
  check('lastName', 'apellido es obligatorio').isEmpty(),
  check('dni', 'dni debe contener al menos 7 caracteres').isEmpty().isLength({ min: 7 }),
  check('birthDate', 'fecha de nacimiento es obligatorio').isEmpty(),
  check('address', 'direccion es obligatorio').isEmpty(),
  check('phone', 'telefono es obligatorio').isEmpty(),
  check('email', 'Invalid Email or Password').isEmail()
], user_controller.user_create)

module.exports = app;