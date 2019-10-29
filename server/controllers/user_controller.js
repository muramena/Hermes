const User = require('../models/users');
const Ticket = require('../models/tickets');
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator')

/**
 * Gets all users from the DB.
 * @module user
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @return {Object} - Status, users.
 */
let user_all = function (req, res) {
    User.find({
        //Empty to get all documents in collection
    }).then(function (users, err) {
        if (err) {
            return res.status(400).json({
                ok: false,
            })
        }
        res.send({
            ok: true,
            users: users
        });
    });
}

/**
 * Creates user and saves it in the DB.
 * @module user
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @return {Object} - Status, user.
 */
let user_create = function (req, res) {
    let body = req.body

    let user = new User(
        {
            username: body.username,
            password: body.password, //bcrypt.hashSync(body.password, 10)
            firstName: body.firstName,
            lastName: body.lastName,
            dni: body.dni,
            birthDate: body.birthDate,
            address: body.address,
            phone: body.phone,
            email: body.email,
        }
    );

    user.save((err) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            user: user.toJSON(),
          })
    });
}

/**
 * Delete a user from the DB by ID.
 * @module user
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @return {Object} - Status, user.
 */
let user_delete_by_id = function (req, res) {
    User.findByIdAndUpdate(req.params.id, {$set: {state: false}}, function (err, user) {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        user.state = false;
        res.send({
            ok: true,
            user: user,
        });
    });     
};

/**
 * Get a user from the DB.
 * @module user
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @return {Object} - Status, user.
 */
let user_details = function (req, res) {
    User.findById(req.params.id, (err, user) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            user: user.toJSON(),
        })
    })
}

/**
 * Update a user from the DB by ID.
 * @module user
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @return {Object} - Status, user.
 */
let user_update_by_id = function (req, res) {
    User.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, user) {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.send({
            ok: true,
            user: user,
        });
    });    
};

/**
 * Get all tickets from a user
 * @module user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} List of tickets
 */
let user_tickets = function (req, res) {
    User.findById(req.params.id, (err, user) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
    }).then( function (req, err){
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        Ticket.find({ user: req.username }).then(function (tickets, err) {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            res.send({
                ok: true,
                tickets: tickets
            });
        });
    })
}

/**
 * Autenticates User.
 * @module user
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @return {Object} res .
 */
let login = function (req, res) {
    var errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.session.errors = errors.array();
        req.session.success = false;
    } else {
        //Esto no esta funcionando, no se como pasar el id. 
        User.findOne({username: req.body.username}, (err, user) => { // chequear User = null
            if (err) {
                req.session.success = false;
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            if (!user) {
                req.session.success = false;
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Usuario o contraseña incorrectos' // Usuario en este caso
                    }
                });
            }

            if (user.password === req.body.password){ //bcrypt.hashSync(req.params.password, 10)
                req.session.success = true;
                return res.status(200).json({
                    ok: true,
                    user: user.toJSON(),
                })
            } else {
                req.session.success = false;
                return res.status(401).json({
                    ok: false,
                    error: 'Usuario o contraseña incorrectos'
                })
            }  
        })
    }
}


module.exports = {
    user_all: user_all,
    user_create: user_create,
    user_details: user_details,
    user_delete_by_id: user_delete_by_id,
    user_update_by_id: user_update_by_id,
    user_tickets: user_tickets,
    login: login
}