const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('lodash');

const Usuario = require('../models/usuario')

const app = express();



// parse application/x-www-form-urlencoded
app.get('/', (req, res) => {
  res.json('Hello World');
});

app.get('/usuario', (req, res) => {

  let desde = Number(req.query.desde) || 0;
  let limite = Number(req.query.limite) || 10;

  Usuario.find({estado: true}, 'nombre email role estado google img')
    .skip(desde)
    .limit(limite)
    .exec((err, usuarios) => {

      if (err) {
        return res.status(400).json({
          ok: false,
          err
        })
      }

      Usuario.count({estado: true}, (err, total) =>{
        res.json({
          ok: true,
          total,
          usuarios
        })
      })

    });

});

app.post('/usuario', (req, res) => {

  let body = req.body;

  let usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role
  });

  usuario.save( (err, usuarioDB) => {

    if (err) {
      return res.status(400).json({
        ok: false,
        err
      })
    }
    let us = _.pick(usuarioDB, ['nombre','email','img','role','estado']);
    res.json({
      ok: true,
      usuario: us
    })
  })

});

app.put('/usuario/:id', (req, res) => {

  let id = req.params.id;
  let body =req.body;

  Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }
    res.json ({
      usuarioDB
    });
  });

})


app.delete('/usuario/:id', (req, res) => {

  let id = req.params.id;

  // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
  Usuario.findByIdAndUpdate(id, { estado: false }, { new: true },(err, usuarioBorrado) => {

    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }
    if (!usuarioBorrado) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "Usuario no encontrado"
        }
      });
    }
    res.json ({
      ok: true,
      usuario: usuarioBorrado
    });

  });

});

module.exports = app;
