const express = require('express')
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
], (req, res) => {
  var errors = validationResult(req);

  if (!errors.isEmpty()) {
    req.session.errors = errors.array();
    req.session.success = false;
  } else {
    req.session.success = true;
  }

  res.redirect('/');
})

router.get('/logout', function (req, res) {
  req.session.success = false;
  res.render(path.resolve(__dirname, '../../public/views/login'));
})

/**
 * USERS
 */

router.get('/usuarios', function (req, res) {
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