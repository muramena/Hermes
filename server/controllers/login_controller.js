const { check, validationResult } = require('express-validator')
const express = require('express')
const User = require('../models/users');

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
        req.session.success = true;
    }
    
    res.redirect('/');
}

module.exports = {
    login: login,
}