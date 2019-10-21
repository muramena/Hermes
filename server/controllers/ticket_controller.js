const Ticket = require('../models/tickets');

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
    Ticket.findById(req.params.id, function (err, ticket) {
        if (err) return next (err);
        res.send('Ticket Deleted');
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

module.exports = {
    ticket_all: ticket_all,
    ticket_create: ticket_create,
    ticket_delete_by_id: ticket_delete_by_id,
    ticket_details: ticket_details,
    ticket_update_by_id: ticket_update_by_id,
}