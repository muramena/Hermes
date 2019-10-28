const express = require('express')
const path = require('path')

var router = express.Router()

/**
 * LOGIN - HOME
 */

router.get('/', function (req, res) {
  if (req.session.success) {
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

/**
 * LOGOUT
 */

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