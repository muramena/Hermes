const Specialist = require('../models/specialists');

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
            user: body.userID,
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

module.exports = {
    specialist_all: specialist_all,
    specialist_create: specialist_create,
    specialist_update_by_id: specialist_update_by_id,
}