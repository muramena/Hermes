const express = require('express')
const path = require('path')

var router = express.Router()

/**
 * LOGIN - HOME
 */

router.get('/', function (req, res) {
  if (req.session.success) {
    res.render(path.resolve(__dirname, '../../public/views/index'), {
      session: req.session.success,
      user: req.session.user
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
 * SIGNUP
 */

router.get('/signup', function (req, res) {
  if (!!req.session.success) {
    res.render(path.resolve(__dirname, '../../public/views/index'), {
      session: req.session.success
    });
  } else {
    res.render(path.resolve(__dirname, '../../public/views/signup'), {
      errors: req.session.errors,
      signup: true
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
    user: req.session.user,
    title: 'Usuario'
  });
})

/**
 * TICKETS
 */

router.get('/ticket', function (req, res) {
  res.render(path.resolve(__dirname, '../../public/views/ticket'), {
    session: req.session.success,
    user: req.session.user,
    title: 'Crear Ticket'
  });
})

/**
 * MIS TICKETS
 */

router.get('/mistickets', function (req, res) {
  res.render(path.resolve(__dirname, '../../public/views/misTickets'), {
    session: req.session.success,
    user: req.session.user,
    title: 'Mis Ticket'
  });
})

module.exports = router;