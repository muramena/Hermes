const { check, validationResult } = require('express-validator');
const express = require('express');
const Sector = require('../models/sectors');
const Specialist = require('../models/specialists');
const Ticket = require('../models/tickets');

let app = express();

/**
 * Gets all sector from the DB.
 * @module sector
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @return {Object} - Status, sector.
 */
let sector_all = function (req, res) {
    Sector.find({
        //Empty to get all documents in collection
    }).then(function (sector, err) {
        if (err) {
            return res.status(400).json({
                ok: false,
            })
        }
        res.send({
            ok: true,
            sector: sector
        });
    });
}

/**
 * Creates sector and saves it in the DB.
 * @module sector
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @return {Object} - Status, sector.
 */
let sector_create = function (req, res) {
    let body = req.body

    let sector = new Sector(
        {
            description: body.description,
            jefe: body.jefe,
        }
    );

    sector.save((err) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            sector: sector,
          })
    });
}

/**
 * Update a sector from the DB by ID
 * @module sectors
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @return {Object} - Status, sector.
 */
let sector_update_by_id = function (req, res) {
    Sector.findByIdAndUpdate( req.params.id, {$set: req.body}, function (err, sector) {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.send({
            ok: true,
            sector: sector,
        });
    }); 
};

/** IMPLEMENTAR */
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
    factorCarga: factorCarga,
    sector_create: sector_create,
    sector_all: sector_all,
    sector_update_by_id: sector_update_by_id
}