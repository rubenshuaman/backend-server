var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

var app = express();

var Usuario = require('../models/usuario');

// Login
app.post('/', (request, response) => {
    var body = request.body;
    Usuario.findOne({ email: body.email }, (err, usuario) => {
        if (err) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: error
            });
        }

        if (!usuario) {
            return response.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrestas - email',
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.password, usuario.password)) {
            return response.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrestas - password',
                errors: err
            });
        }

        usuario.password = ':)';
        // Crear token
        var token = jwt.sign({ usuario: usuario }, SEED, { expiresIn: 14400 }); // 4 horas

        response.status(200).json({
            ok: true,
            usuario: usuario,
            token: token
        });
    });
});

module.exports = app;