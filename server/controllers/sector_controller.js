const { check, validationResult } = require('express-validator');
const express = require('express');
const Sector = require('../models/sectors');
const Specialist = require('../models/specialists');
const Ticket = require('../models/tickets');

let app = express();

let factorCarga = function (req, res) {
    //todos los especialistas del sector
    Specialist.find({ sector: req.params.id }, (err, specialists) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
    }).then((spec, err) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
    })
}

module.exports = {
    factorCarga: factorCarga
}