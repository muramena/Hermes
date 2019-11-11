const { check, validationResult } = require('express-validator');
const express = require('express');
const Sector = require('../models/sectors');
const Specialist = require('../models/specialists');
const Ticket = require('../models/tickets');
const path = require('path')

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

let factorCarga = function (req, res) {
    if (!req.session.success || req.session.user.type != 2) {
        res.render(path.resolve(__dirname, '../../public/views/login'), {
            errors: [{
              msg: 'Debe estar logeado como Jefe de Area para entrar a los reportes'
            }]
        })
        return req.session.errors = null;
    }
    Ticket.find({state: true, status: 1}, (err, ticketsActivos) => {
        if (err) {
            res.render(path.resolve(__dirname, '../../public/views/login'), {
                errors: [{
                  msg: 'Error al conectar con Base de Datos'
                }]
            })
            return req.session.errors = null;
        }
        Specialist.find({state: true, rol: 0}, (err, specialistsDB) => {
            var specialistsDesarrollo = specialistsDB.filter(e => e.sector === 0).length
            var specialistsComunicaciones = specialistsDB.filter(e => e.sector === 1).length
            var specialistsSoporte = specialistsDB.filter(e => e.sector === 2).length

            var ticketsDesarrollo = ticketsActivos.filter(e => e.category < 3).length
            var ticketsComunicaciones = ticketsActivos.filter(e => e.category > 2 && e.category < 6).length
            var ticketsSoporte = ticketsActivos.filter(e => e.category > 5).length

            return res.render(path.resolve(__dirname, '../../public/views/reports'), {
                session: req.session.success,
                user: req.session.user,
                title: 'Reportes',
                desarrollo: {
                    specialists: specialistsDesarrollo,
                    tickets: ticketsDesarrollo,
                    factor: Math.round(ticketsDesarrollo/specialistsDesarrollo * 100) / 100
                },
                soporte: {
                    specialists: specialistsSoporte,
                    tickets: ticketsSoporte,
                    factor: Math.round(ticketsSoporte/specialistsSoporte * 100) / 100
                },
                comunicaciones: {
                    specialists: specialistsComunicaciones,
                    tickets: ticketsComunicaciones,
                    factor: Math.round(ticketsComunicaciones/specialistsComunicaciones * 100) / 100
                },
                active: {
                  reportes: true
                }
              })
        }) 
    })
}

module.exports = {
    factorCarga: factorCarga,
    sector_create: sector_create,
    sector_all: sector_all,
    sector_update_by_id: sector_update_by_id
}