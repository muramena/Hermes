const path = require('path')
const User = require('../models/users')
const Specialist = require('../models/specialists');
const Ticket = require('../models/tickets')
const bcrypt = require('bcrypt')
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
  var errors = validationResult(req);

  if (!errors.isEmpty()) {
    // ALGUN ERROR EN LA PRIMERA VERIFICACION (DESDE EXPRESS)
    req.session.errors = errors.array();
    req.session.success = false;
    res.render(path.resolve(__dirname, '../../public/views/signup'), {
      ok: false,
      errors: errors.errors
    })
    return req.session.errors = null;
  } else {
    let body = req.body

    if (req.body.password != req.body.confirmPassword){
      // VUELVE A SIGNUP POR CONTRASEÑAS DISTINTAS
      req.session.success = false;
      res.render(path.resolve(__dirname, '../../public/views/signup'), {
        errors: [{
          msg: 'Contraseñas distintas'
        }]
      })
      return req.session.errors = null;
    }

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
        email: body.email
      }
    );

    user.save((err) => {
      if (err) {
        // VUELVE A SIGNUP POR USUARIO DUPLICADO
        req.session.success = false;
        res.render(path.resolve(__dirname, '../../public/views/signup'), {
          ok: false,
          errors: [{
            msg: 'Ya hay algún usuario registrado con el mismo mail, DNI y/o nombre de usuario'
          }]
        })
        return req.session.errors = null;
      }
      // REDIRECCION A LOGIN DESPUES DE CREAR USUARIO EN BASE DE DATOS
      req.session.success = false;
      res.render(path.resolve(__dirname, '../../public/views/login'), {
        ok: false,
        errors: errors.errors
      })
      return req.session.errors = null;
    });
  }
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
  User.findByIdAndUpdate(req.params.id, { $set: { state: false } }, function (err, user) {
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
      user: user.toJSON()
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
  User.findByIdAndUpdate(req.params.id, { $set: req.body }, function (err, user) {
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
 * Autenticates User.
 * @module user
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @return {Object} res .
 */
let login = function (req, res) {
  var errors = validationResult(req);
  req.session.success = false;

  if (!errors.isEmpty()) {
    req.session.errors = errors.array();
    req.session.success = false;
    res.render(path.resolve(__dirname, '../../public/views/login'), {
      ok: false,
      errors: errors.errors
    })
    return req.session.errors = null;
  } else {
    User.findOne({ username: req.body.username }, (err, user) => {
      if (err) {
        req.session.success = false;
         res.render(path.resolve(__dirname, '../../public/views/login'), {
          errors: [{
            msg: '400'
          }]
        })
        return req.session.errors = null;
      }

      // chequear User = null
      if (!user) {
        req.session.success = false;
        res.render(path.resolve(__dirname, '../../public/views/login'), {
          errors: [{
            msg: 'Usuario y/o contraseña no válidos'
          }]
        })
        return req.session.errors = null;
      }

      if (user.password === req.body.password) { //bcrypt.hashSync(req.params.password, 10)
        // Set session & user
        Specialist.findOne({username: req.body.username}, (err, specialist) => {
          if (err) {
            // NO CONECTA CON DB
            req.session.success = false;
            res.render(path.resolve(__dirname, '../../public/views/login'), {
              errors: [{
                msg: '400'
              }]
            })
            return req.session.errors = null;
          }
          if (!specialist) {
            user.type = -1
          } else {
            user.type = specialist.rol 
          }
          req.session.user = user
          req.session.success = true

          return res.redirect('/')
        })
      } else {
        req.session.success = false;
        res.render(path.resolve(__dirname, '../../public/views/login'), {
          errors: [{
            msg: 'Usuario y/o contraseña incorrectos'
          }]
        })
        return req.session.errors = null;
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
  login: login
}