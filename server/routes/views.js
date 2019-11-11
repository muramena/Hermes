const express = require('express')
const path = require('path')
const ticket_controller = require('../controllers/ticket_controller')
const specialist_controller = require('../controllers/specialist_controller')
const sector_controller = require('../controllers/sector_controller')

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
    title: 'Crear Ticket',
    active: {
      ticket: true
    }
  });
})

/**
 * MIS TICKETS CREADOS
 */

router.get('/mistickets', ticket_controller.ticket_my_tickets)

/**
 * MIS TICKETS ASIGNADOS
 */

router.get('/asignados', ticket_controller.ticket_my_assigned_tickets)

/**
 * SEGUIMIENTO DE TICKETS
 */

router.get('/seguimiento', ticket_controller.ticket_all)

/**
 * GESTION DE ESPECIALISTAS
 */

router.get('/especialistas', specialist_controller.specialist_all)

router.get('/reportes', sector_controller.factorCarga)

module.exports = router;