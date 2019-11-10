const Ticket = require('../models/tickets');
const Specialist = require('../models/specialists');
const User = require('../models/users');
const path = require('path')
const { check, validationResult } = require('express-validator')

/**
 * ticket_all: Gets all tickets from the DB
 * ticket_my_tickets
 * ticket_my_assigned_tickets
 * ticket_create
 * ticket_delete_by_id
 * ticket_details
 * ticket_update_by_id
 * ticket_cancel_by_id
 * ticket_status_inProgress_by_id
 * ticket_assign_to_specialist
 * ticket_divide
 * 
 */

/**
 * Gets all tickets from the DB.
 * @module ticket
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @return {Object} - Status, ticket.
 */

let ticket_all = function (req, res) {
  if (!req.session.success) {
    // REDIRECCIONA A LOGIN POR NO ESTAR LOGUEADO
    res.render(path.resolve(__dirname, '../../public/views/login'), {
      errors: [{
        msg: 'Debe estar logueado para ver sus tickets'
      }]
    })
    return req.session.errors = null;
  }

  Ticket.find({}, (err, ticketsDB) => {
    if (err) {
      // NO CONECTA CON DB
      req.session.success = false;
      res.render(path.resolve(__dirname, '../../public/views/login'), {
        errors: [{
          msg: '400'
        }]
      })
      return req.session.errors = null;
    }
    let filteredTickets = ticketsDB.filter(e => e.state != false)

    return res.render(path.resolve(__dirname, '../../public/views/ticket-detail'), {
      session: req.session.success,
      user: req.session.user,
      title: 'Seguimiento Tickets',
      tickets: filteredTickets,
      active: {
        seguimiento: true
      }
    })
  })
}

let ticket_my_tickets = function (req, res) {
  if (!req.session.success) {
    // REDIRECCIONA A LOGIN POR NO ESTAR LOGUEADO
    res.render(path.resolve(__dirname, '../../public/views/login'), {
      errors: [{
        msg: 'Debe estar logueado para ver sus tickets'
      }]
    })
    return req.session.errors = null;
  }

  Ticket.find({ user: req.session.user.username, state: true }, (err, ticketsDB) => {
    if (err) {
      // NO CONECTA CON DB
      req.session.success = false;
      res.render(path.resolve(__dirname, '../../public/views/login'), {
        errors: [{
          msg: '400'
        }]
      })
      return req.session.errors = null;
    }
    return res.render(path.resolve(__dirname, '../../public/views/ticket-detail'), {
      session: req.session.success,
      user: req.session.user,
      title: 'Mis Tickets',
      tickets: ticketsDB,
      active: {
        mistickets: true
      }
    })
  })
}

let ticket_my_assigned_tickets = function (req, res) {
  if (!req.session.success) {
    // REDIRECCIONA A LOGIN POR NO ESTAR LOGUEADO
    res.render(path.resolve(__dirname, '../../public/views/login'), {
      errors: [{
        msg: 'Debe estar logueado para ver sus tickets'
      }]
    })
    return req.session.errors = null;
  }

  Ticket.find({ assignedSpecialist: req.session.user.username }, (err, ticketsDB) => {
    if (err) {
      // NO CONECTA CON DB
      req.session.success = false;
      res.render(path.resolve(__dirname, '../../public/views/login'), {
        errors: [{
          msg: '400'
        }]
      })
      return req.session.errors = null;
    }
    return res.render(path.resolve(__dirname, '../../public/views/ticket-detail'), {
      session: req.session.success,
      user: req.session.user,
      title: 'Mis Tickets Asignados',
      tickets: ticketsDB,
      active: {
        asignados: true
      }
    })
  })
}

/**
 * Creates ticket and saves it in the DB.
 * @module ticket
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @return {Object} - Status, ticket.
 */
let ticket_create = function (req, res) {
  var errors = validationResult(req);

  if (!errors.isEmpty()) {
    // ALGUN ERROR EN LA PRIMERA VERIFICACION (DESDE EXPRESS)
    req.session.errors = errors.array();
    res.render(path.resolve(__dirname, '../../public/views/ticket'), {
      session: req.session.success,
      user: req.session.user,
      errors: errors.errors
    })
    return req.session.errors = null;
  }

  let body = req.body;
  if (!req.session.success) {
    // REDIRECCIONA A LOGIN POR NO ESTAR LOGUEADO
    res.render(path.resolve(__dirname, '../../public/views/login'), {
      errors: [{
        msg: 'Debe estar logueado para crear un ticket'
      }]
    })
    return req.session.errors = null;
  }
  let username = req.session.user.username
  User.findOne({ username }, (err, user) => {
    if (err) {
      // NO CONECTA CON DB
      req.session.success = false;
      res.render(path.resolve(__dirname, '../../public/views/login'), {
        errors: [{
          msg: '400'
        }]
      })
      return req.session.errors = null;
    }
    if (!user) {
      // ESTA LOGUEADO PERO SIN EXISTIR EN LA BASE DE DATOS
      req.session.success = false;
      res.render(path.resolve(__dirname, '../../public/views/ticket'), {
        errors: [{
          msg: 'Usted no existe en la Base de Datos'
        }]
      })
      return req.session.errors = null;
    }
    console.log(body.priority)

    let ticket = new Ticket({
      user: username,
      title: body.title,
      description: body.description,
      category: body.category
    });
    if (body.switchPrioDate === 'date') {
      ticket.deadlineDate = new Date(body.deadline);
    } else {
      ticket.priority = body.priority
    }

    ticket.save((err) => {
      if (err) {
        // ERROR AL CREAR EL TICKET
        res.render(path.resolve(__dirname, '../../public/views/ticket'), {
          session: req.session.success,
          user: req.session.user,
          errors: [{
            msg: 'Error al crear el ticket'
          }]
        })
        return req.session.errors = null;
      }
      // TICKET CREADO
      return res.redirect('/mistickets')
    });
  });
}

/**
 * Delete a ticket from the DB by ID.
 * @module ticket
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @return {Object} - Status, ticket
 */
let ticket_delete_by_id = function (req, res) {
  Ticket.findByIdAndUpdate(req.params.id, { $set: { state: false } }, function (err, ticket) {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      })
    }
    if (!ticket) {
      return res.redirect('/')
    }
    return res.json({
      ok: true
    })
  });
};

/**
 * Get a ticket from the DB.
 * @module ticket
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @return {Object} - Status, ticket.
 */
let ticket_details = function (req, res) {
  Ticket.findById(req.params.id, (err, ticket) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      })
    }
    if (!ticket) {
      return res.status(400).json({
        ok: false,
        message: 'ticket no existe'
      })
    }
    res.json({
      ok: true,
      ticket: ticket,
    })
  })
}

/**
 * Update a ticket from the DB by ID.
 * @module ticket
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @return {Object} - Status, ticket.
 */
let ticket_update_by_id = function (req, res) {
  Ticket.findByIdAndUpdate(req.params.id, { $set: req.body }, function (err, ticket) {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      })
    }
    res.send({
      ok: true,
      ticket: ticket,
    });
  });
};

/**
 * Update a ticket from the DB by ID.
 * @module ticket
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} req.body
 * @return {Object} - Status, ticket.
 */
let ticket_cancel_by_id = function (req, res) {
  Ticket.findOne({ _id: req.params.id }, function (err, ticket) {
    if (err) {
      return res.status(400).json({
        ok: false,
        message: 'No conecta con DB',
        err
      })
    }
    if (!ticket) {
      return res.status(400).json({
        ok: false,
        message: 'el ticket no existe'
      })
    }
    if (ticket.user != req.session.user.username){
      return res.status(400).json({
        ok: false,
        message: 'el ticket no fue creado por este usuario'
      })
    }
    ticket.state = false
    ticket.save((err) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        })
      }
    });
    res.send({
      ok: true,
      ticket: ticket,
    });
  });
};

/**
 * Set ticket status to in progress
 */
let ticket_setStatus_inProgress_by_id = function (req, res) {
  Ticket.find({ assignedSpecialist: req.session.user.username, status: 2}, function (err, ticket) {
    if (err) {
      return res.status(400).json({
        ok: false,
        message: 'No conecta con DB',
        err
      })
    }
    if (ticket) {
      return res.status(400).json({
        ok: false,
        message: 'usuario ya tiene un ticket en progreso'
      })
    }
    Ticket.findByIdAndUpdate(req.params.id, { status: 2 }, function (err, ticket) {
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        })
      }
      res.send({
        ok: true,
        ticket: ticket,
      });
    });
  });
}

/**
 * Assign ticket to specialist by ticket id and user username.
 * @module ticket
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} req.params.id - Ticket ID
 * @param {Object} req.body.username - user username
 * @return {Object} - Status, ticket.
 */
let ticket_assign_to_specialist = function (req, res) {
  Specialist.findOne({ username: req.body.username }, (err, specialist) => {
    if (err || !specialist) {
      return res.status(400).json({
        ok: false,
        message: 'specialist no existe',
        err
      })
    }
    Ticket.findByIdAndUpdate(req.params.id, { $set: { assignedSpecialist: req.body.username } }, (err, ticket) => {
      if (err || !ticket) {
        return res.status(400).json({
          ok: false,
          message: 'ticket no existe',
          err
        })
      }
      res.send({
        ok: true,
        ticket: ticket,
      });
    });
  });
};

/**
 * Divide a ticket from the DB into two tickets.
 * @module ticket
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {String} subTicket1Title - subTicket1Title
 * @param {String} subTicket2Title - subTicket2Title
 * @param {String} subTicket1Description - subTicket1Description
 * @param {String} subTicket2Description - subTicket2Description
 * @param {String} subTicket2Category - subTicket2Category
 * @return {Object} - Status, ticket.
 */
let ticket_divide = function (req, res) {
  Ticket.findById(req.params.id, function (err, ticket) {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      })
    }

    if (!ticket) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'ticket no existe'
        }
      })
    }

    //como hacer los dos nuevos tickets
    let subTicket1 = new Ticket({
      user: req.params.user || ticket.user,
      title: req.params.subTicket1Title || ticket.title,
      description: req.params.subTicket1Description || ticket.description,
      category: ticket.category,
      priority: ticket.priority,
      deadlineDate: ticket.deadlineDate,
      parentTicket: ticket._id,
      status: ticket.status,
      assignedSpecialist: ticket.assignedSpecialist,
    });
    let subTicket2 = new Ticket({
      user: req.params.user || ticket.user,
      title: req.params.subTicket2Title || ticket.title,
      description: req.params.subTicket2Description || ticket.description,
      category: req.params.subTicket2Category || ticket.category,
      priority: ticket.priority,
      deadlineDate: ticket.deadlineDate,
      parentTicket: ticket._id,
      status: ticket.status,
      assignedSpecialist: ticket.assignedSpecialist,
    });

    subTicket1.save((err) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        })
      }
    });

    subTicket2.save((err) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        })
      }
    });

    ticket.status = 'en espera'

    ticket.save((err) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        })
      }
    });

    res.send({
      ok: true,
      ticket: ticket,
      subTicket1: subTicket1,
      subTicket2: subTicket2
    });
  })
};

module.exports = {
  ticket_all: ticket_all,
  ticket_my_tickets: ticket_my_tickets,
  ticket_my_assigned_tickets: ticket_my_assigned_tickets,
  ticket_setStatus_inProgress_by_id: ticket_setStatus_inProgress_by_id,
  ticket_create: ticket_create,
  ticket_delete_by_id: ticket_delete_by_id,
  ticket_details: ticket_details,
  ticket_divide: ticket_divide,
  ticket_update_by_id: ticket_update_by_id,
  ticket_assign_to_specialist: ticket_assign_to_specialist,
  ticket_cancel_by_id: ticket_cancel_by_id,
}