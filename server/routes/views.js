const express = require('express')
const path = require('path')
const ticket_controller = require('../controllers/ticket_controller')

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
  res.redirect('/');
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
 * MIS TICKETS CREADOS
 */

router.get('/mistickets', ticket_controller.ticket_my_tickets) /*function (req, res) {
  res.render(path.resolve(__dirname, '../../public/views/misTickets'), {
    session: req.session.success,
    user: req.session.user,
    title: 'Mis Ticket'
  });
}) */

/**
 * MIS TICKETS ASIGNADOS
 */

 router.get('/misticketsasignados', ticket_controller.ticket_my_assigned_tickets)

module.exports = router;