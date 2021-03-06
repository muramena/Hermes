const Ticket = require('../models/tickets')
const Specialist = require('../models/specialists')
const User = require('../models/users')
const path = require('path')
const { check, validationResult } = require('express-validator')

var ObjectId = require('mongoose').Types.ObjectId; 

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
  Specialist.findOne({username: req.session.user.username}, (err, specialist) => {
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
    if (!specialist || specialist.rol === 0) {
      // NO CONECTA CON DB
      req.session.success = false;
      res.render(path.resolve(__dirname, '../../public/views/login'), {
        session : req.session.succes,
        errors: [{
          msg: 'No tiene acceso a esta zona del sitio'
        }]
      })
      return req.session.errors = null;
    }
    Ticket.find({state: true}, (err, ticketsDB) => {
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

      console.log(specialist)

      filteredTickets = ticketsDB.filter(e => e.status != 3 || e.status !=4)
      if (specialist.rol === 1){
        if (specialist.sector === 0){
          filteredTickets = filteredTickets.filter(e => e.category === 0 || e.category === 1 || e.category === 2)
        }
        if (specialist.sector === 1){
          filteredTickets = filteredTickets.filter(e => e.category === 3 || e.category === 4 || e.category === 5)
        }
        if (specialist.sector === 2){
          filteredTickets = filteredTickets.filter(e => e.category === 6 || e.category === 7)
        }
      }

      Specialist.find({}, (err, specialists) => {
        if (err) {
          return res.redirect('/')
        }
        specialists = specialists.filter(e => e.sector === specialist.sector)
        return res.render(path.resolve(__dirname, '../../public/views/ticket-detail'), {
          session: req.session.success,
          user: req.session.user,
          title: 'Seguimiento Tickets',
          tickets: filteredTickets,
          specialists,
          active: {
            seguimiento: true
          }
        })
      })
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

  Ticket.find({ assignedSpecialist: req.session.user.username, state: true }, (err, ticketsDB) => {
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
  if (!req.session.success) {
    // REDIRECCIONA A LOGIN POR NO ESTAR LOGUEADO
    res.render(path.resolve(__dirname, '../../public/views/login'), {
      errors: [{
        msg: 'Debe estar logueado para eliminar un ticket'
      }]
    })
    return req.session.errors = null;
  }
  Ticket.findByIdAndUpdate(req.params.id, { $set: { state: false } }, async function (err, ticket) {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      })
    }
    if (!ticket) {
      return res.json({
        ok: false
      })
    }
    const cascade = await Ticket.updateMany({parentTicket: new ObjectId(req.params.id)}, { state: false})
    if (ticket.parentTicket) {
      Ticket.find({parentTicket: ticket.parentTicket}, (err, otherTicket) => {
        if (err || !otherTicket){
          return res.json({
            ok: true,
            message: 'No tiene ticket hermano'
          })
        }
        if (otherTicket[0]._id == req.params.id){
          otherTicket = otherTicket[1]
        } else {
          otherTicket = otherTicket[0]
        }
        if (otherTicket.status === 3 || otherTicket.status === 4 || otherTicket.state === false){
          if (otherTicket.state) {
            var change = {status: otherTicket.status}
          } else {
            var change = {state: false}
          }
          Ticket.findByIdAndUpdate(ticket.parentTicket, {$set:change}, (err, parent) => {
            if (err || !parent){
              return res.json({
                ok: false,
                message: 'Error con el padre'
              })
            }
            return res.json({
              ok: true,
              message: 'Tambien se actualizo el padre'
            })
          })
        } else {
          return res.json({
            ok: true,
            message: 'El hermano ya estaba resuelto'
          })
        }
      })
    } else {
      return res.json({
        ok: true,
        message: 'No tenia ticket padre'
      })
    }
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
let ticket_cancel_by_id = async function (req, res) {
  if (!req.session.success) {
    // REDIRECCIONA A LOGIN POR NO ESTAR LOGUEADO
    res.render(path.resolve(__dirname, '../../public/views/login'), {
      errors: [{
        msg: 'Debe estar logueado para cancelar un ticket'
      }]
    })
    return req.session.errors = null;
  }
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
    Ticket.findByIdAndUpdate(req.params.id, { $set: { status: 4 } }, async function (err, ticket) {
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        })
      }
      if (!ticket) {
        return res.json({
          ok: false,
          message: 'El ticket no existe'
        })
      }
      // CANCELA LOS SUBTICKETS
      const cascade = await Ticket.updateMany({parentTicket: new ObjectId(req.params.id)}, { status: 4 })
      if (ticket.parentTicket) {
        Ticket.find({parentTicket: ticket.parentTicket}, (err, otherTicket) => {
          if (err || !otherTicket){
            return res.json({
              ok: true,
              message: 'No tiene ticket hermano'
            })
          }
          if (otherTicket[0]._id == req.params.id){
            otherTicket = otherTicket[1]
          } else {
            otherTicket = otherTicket[0]
          }
          if (otherTicket.status === 3 || otherTicket.status === 4 || otherTicket.state === false){
            if (otherTicket.state) {
              var newStatus = otherTicket.status
            } else {
              var newStatus = 4
            }
            Ticket.findByIdAndUpdate(ticket.parentTicket, {$set:{status: newStatus}}, (err, parent) => {
              if (err || !parent){
                return res.json({
                  ok: false,
                  message: 'Error con el padre'
                })
              }
              return res.json({
                ok: true,
                message: 'Tambien se actualizo el padre'
              })
            })
          } else {
            return res.json({
              ok: true,
              message: 'El hermano ya estaba resuelto'
            })
          }
        })
      } else {
        return res.json({
          ok: true,
          message: 'No tenia ticket padre'
        })
      }
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
  Specialist.findOne({ username: req.body.specialist }, (err, specialist) => {
    if (err || !specialist) {
      return res.status(400).json({
        ok: false,
        message: 'specialist no existe',
        err
      })
    }
    Ticket.findByIdAndUpdate(req.params.id, { $set: { assignedSpecialist: req.body.specialist, status: 1 } }, (err, ticket) => {
      if (err || !ticket) {
        return res.status(400).json({
          ok: false,
          message: 'Error',
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
  if (!req.params.id || !req.body.title1 || !req.body.title2 || !req.body.description1 || !req.body.description2 || !req.body.category2) {
    return res.json({
      ok: false,
      message: 'Campos incompletos'
    })
  }
  Ticket.findByIdAndUpdate(req.params.id, { $set: { status: 5 } }, function (err, ticket) {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      })
    }
    if (!ticket) {
      return res.json({
        ok: false,
        message: 'El ticket no existe'
      })
    }
    console.log(req)
    let subTicket1 = new Ticket({
      user: ticket.user,
      title: req.body.title1, 
      description: req.body.description1, 
      category: ticket.category,
      priority: ticket.priority,
      deadlineDate: ticket.deadlineDate,
      parentTicket: ticket._id,
      status: 1,
      assignedSpecialist: ticket.assignedSpecialist,
    });
    let subTicket2 = new Ticket({
      user: ticket.user,
      title: req.body.title2, 
      description: req.body.description2, 
      category: req.body.category2, 
      priority: ticket.priority,
      deadlineDate: ticket.deadlineDate,
      parentTicket: ticket._id,
      status: 0
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

    return res.redirect('/asignados')
  })
};

let ticket_resolve = function (req, res) {
  Ticket.findByIdAndUpdate(req.params.id, { $set: { status: 3 } }, async function (err, ticket) {
    if (err || !ticket) {
      return res.json({
        ok: false,
        message: 'Error al resolver ticket'
      })
    }
    if (ticket.parentTicket) {
      Ticket.find({parentTicket: ticket.parentTicket}, (err, otherTicket) => {
        if (err || !otherTicket){
          return res.json({
            ok: true,
            message: 'No tiene ticket hermano'
          })
        }
        console.log(otherTicket[0]._id)
        console.log(req.params.id)
        if (otherTicket[0]._id == req.params.id){
          otherTicket = otherTicket[1]
        } else {
          otherTicket = otherTicket[0]
        }
        console.log(otherTicket)
        if (otherTicket.status === 3 || otherTicket.status === 4 || otherTicket.state === false){
          Ticket.findByIdAndUpdate(ticket.parentTicket, {$set:{status:3}}, (err, parent) => {
            if (err || !parent){
              return res.json({
                ok: false,
                message: 'Error con el padre'
              })
            }
            console.log('Actualizando padre')
            return res.json({
              ok: true,
              message: 'Tambien se actualizo el padre'
            })
          })
        } else {
          return res.json({
            ok: true,
            message: 'El hermano ya estaba resuelto'
          })
        }
      })
    } else {
      return res.json({
        ok: true,
        message: 'No tenia ticket padre'
      })
    }
  })
}

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
  ticket_resolve: ticket_resolve
}