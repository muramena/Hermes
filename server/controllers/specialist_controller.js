const Specialist = require('../models/specialists');
const Sector = require('../models/sectors');

/**
 * Gets all specialist from the DB.
 * @module specialist
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @return {Object} - Status, specialist.
 */
let specialist_all = function (req, res) {
    Specialist.find({
        //Empty to get all documents in collection
    }).then(function (specialist, err) {
        if (err) {
            return res.status(400).json({
                ok: false,
            })
        }
        res.send({
            ok: true,
            specialist: specialist
        });
    });
}

/**
 * Creates specialist and saves it in the DB.
 * @module specialist
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @return {Object} - Status, specialist.
 */
let specialist_create = function (req, res) {
    let body = req.body

    let specialist = new Specialist(
        {
            username: body.username,
            sector: body.sector,
        }
    );

    specialist.save((err) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            specialist: specialist,
          })
    });
}

/**
 * Update a specialist from the DB by ID
 * @module specialists
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @return {Object} - Status, specialists.
 */
let specialist_update_by_id = function (req, res) {
    Specialist.findByIdAndUpdate( req.params.id, {$set: req.body}, function (err, specialist) {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.send({
            ok: true,
            specialist: specialist,
        });
    }); 
};

/**
 * Update a specialist sector from the DB by ID
 * @module specialists
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} id - req.params.id specialist id
 * @return {Object} - Status, specialists.
 */
let specialist_assign_to_sector_by_id = function (req, res) {
    if (!(req.body.user === '1' || req.body.user === '2')) {
        return res.status(403).json({
            ok: false,
            message: 'usuario sin acceso'
        })
    }
    Sector.findOne( { _id: req.body.sector }, function (err, sector) {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'sector no existe',
                err
            })
        }

        Specialist.findOne({ _id: req.params.id}, function (err, specialist) {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'especialista no existe',
                    err
                })
            }

            specialist.sector = sector._id
            
            specialist.save((err) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    })
                }
            });
            res.send({
                ok: true,
                specialist: specialist,
            });
        });   
    });
};

module.exports = {
    specialist_all: specialist_all,
    specialist_create: specialist_create,
    specialist_update_by_id: specialist_update_by_id,
    specialist_assign_to_sector_by_id: specialist_assign_to_sector_by_id,
}