const { check, validationResult } = require('express-validator')
const express = require('express')
const User = require('../models/users');

let app = express();

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
        console.log('req', req)
        //Esto no esta funcionando, no se como pasar el id. 
        User.findById(req.params.id, (err, user) => {
            if (err) {
                console.log('error')
                req.session.success = false;
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            console.log('success')
            res.json({
                ok: true,
                user: user.toJSON(),
            })
        })
        req.session.success = true;
    }
    
    res.redirect('/');
}

/**
 * Creates User.
 * @module user
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @return {Object} res .
 */
let register = function (req, res) {
    var errors = validationResults(req);

    if (!errors.isEmpty()) {
        req.session.errors = errors.array();
        req.session.success = false;
    } else {
        //CREAR EL USUARIO
    }

}

module.exports = {
    login: login,
}