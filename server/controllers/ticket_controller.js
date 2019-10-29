const Ticket = require('../models/tickets');
const Specialist = require('../models/specialists');

/**
 * Gets all tickets from the DB.
 * @module ticket
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @return {Object} - Status, ticket.
 */
let ticket_all = function (req, res) {
    Ticket.find({
        //Empty to get all documents in collection
    }).then(function (tickets, err) {
        if (err) {
            return res.status(400).json({
                ok: false,
            })
        }
        res.send({
            ok: true,
            tickets: tickets,
        });
    });
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
    let body = req.body;
    let ticket = new Ticket(
        {
            user: body.user,
            title: body.title,
            description: body.description,
            category: body.category,
            priority: body.priority,
            deadlineDate: body.deadlineDate,
            parentTicket: body.parentTicket,
            status: body.status,
            assignedSpecialist: body.assignedSpecialist,
        }
    );
        
    ticket.save((err) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            ticket: ticket.toJSON(),
          })
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
    Ticket.findByIdAndUpdate(req.params.id, {$set: {state: false}}, function (err, ticket) {
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
        res.json({
            ok: true,
            ticket: ticket.toJSON(),
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
    Ticket.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, ticket) {
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
    Specialist.findOne({username: req.body.username}, (err, specialist) => {
        if (err || !specialist) {
            return res.status(400).json({
                ok: false,
                message: 'specialist no existe',
                err
            })
        }
        Ticket.findByIdAndUpdate(req.params.id, {$set: {assignedSpecialist: req.body.username}}, (err, ticket) => {
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
                    message: 'Ticket no existe'
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
    ticket_create: ticket_create,
    ticket_delete_by_id: ticket_delete_by_id,
    ticket_details: ticket_details,
    ticket_divide: ticket_divide,
    ticket_update_by_id: ticket_update_by_id,
    ticket_assign_to_specialist: ticket_assign_to_specialist,
}