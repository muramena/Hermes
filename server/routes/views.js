const express = require('express')
const login_controller = require('../controllers/login_controller.js')
const path = require('path')
const { check, validationResult } = require('express-validator')

var router = express.Router()

/**
 * Esto deberia estar del lado del Cliente {Creo}
 * 
 * Redirects to corresponding view.
 * @param {String} path 
 */

/**
 * LOGIN - HOME
 */

router.get('/', function (req, res) {
  if (!!req.session.success) {
    res.render(path.resolve(__dirname, '../../public/views/index'), {
      session: req.session.success
    });
  } else {
    res.render(path.resolve(__dirname, '../../public/views/login'), {
      errors: req.session.errors
    });
  }
  req.session.errors = null;
})

router.post('/login', [
  check('email', 'Invalid Email').isEmail(),
  check('password', 'Invalid Username').isLength({ min: 5 })
], login_controller.login);

router.get('/logout', function (req, res) {
  req.session.success = false;
  res.render(path.resolve(__dirname, '../../public/views/login'));
})

/**
 * SIGNIN
 */

router.get('/signin', function (req, res) {
  if (!!req.session.success) {
    res.render(path.resolve(__dirname, '../../public/views/index'), {
      session: req.session.success
    });
  } else {
    res.render(path.resolve(__dirname, '../../public/views/signin'), {
      errors: req.session.errors
    });
  }
  req.session.errors = null;
})

/**
 * USERS
 */

router.get('/usuario', function (req, res) {
  res.render(path.resolve(__dirname, '../../public/views/user'), {
    session: req.session.success,
    title: "Usuario"
  });
})

/**
 * TICKETS
 */

router.get('/tickets', function (req, res) {
  res.render(path.resolve(__dirname, '../../public/views/ticket'))
})

module.exports = router;