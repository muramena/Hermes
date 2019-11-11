const Specialist = require('../models/specialists')
const Sector = require('../models/sectors')
const path = require('path')

/**
 * Gets all specialist from the DB.
 * @module specialist
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @return {Object} - Status, specialist.
 */
let specialist_all = function (req, res) {
  Specialist.find({ state: true, rol: 0 }, (err, specialists) => {
    if (err) {
      return res.redirect('/')
    }
    return res.render(path.resolve(__dirname, '../../public/views/specialists'), {
      session: req.session.success,
      user: req.session.user,
      title: 'Especialistas',
      specialists,
      active: {
        especialistas: true
      }
    })
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
  Sector.findOne({ _id: req.body.sector }, function (err, sector) {
    if (err) {
      return res.status(400).json({
        ok: false,
        message: 'sector no existe',
        err
      })
    }
    let specialist = new Specialist({
      username: body.username,
      sector: body.sector,
    });
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
  Specialist.findByIdAndUpdate(req.params.id, { $set: req.body }, function (err, specialist) {
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
  if (req.body.sector > 2 || req.body.sector < 0) {
    return res.json({
      ok: false,
      message: 'Sector no valido'
    })
  }
  Specialist.findById({ username: req.session.user.username }, (err, activeUser) => {
    if (err || !activeUser || activeUser.rol != 2) {
      return res.json({
        ok: false,
        message: 'No tiene permisos'
      })
    }
    Specialist.findByIdAndUpdate({ username: req.body.specialist }, { $set: { sector: req.body.sector } }, (err, upSpecialist) => {
      if (err || !upSpecialist) {
        return res.json({
          ok: false,
          message: "error"
        })
      }
      // desasignar tickets
      return res.json({
        ok: true,
        upSpecialist
      })
    })
  })
};

module.exports = {
  specialist_all: specialist_all,
  specialist_create: specialist_create,
  specialist_update_by_id: specialist_update_by_id,
  specialist_assign_to_sector_by_id: specialist_assign_to_sector_by_id,
}