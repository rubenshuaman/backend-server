var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Usuario = require('../models/usuario');

// Obtener usuarios
app.get('/', (request, response, next) => {

    Usuario.find({}, 'nombre email img role')
        .exec(
            (error, usuarios) => {
                if (error) {
                    return response.status(500).json({
                        ok: false,
                        mensaje: 'Error al cargar usuarios',
                        errors: error
                    });
                }

                response.status(200).json({
                    ok: true,
                    usuarios: usuarios
                });
            });
});

// Verificar token funciona de este método para ajabo
/*app.use('/', (request, response, next) => {
    var token = request.query.token;

    jwt.verify(token, SEED, (error, decoded) => {
        if (error) {
            return response.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto',
                errors: error
            });
        }
        next();

    });
});*/

// Crear usuario
app.post('/', mdAutenticacion.verificarToken, (request, response) => {
    var body = request.body;
    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((error, usuario) => {
        if (error) {
            return response.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: error
            });
        }

        response.status(201).json({
            ok: true,
            usuario: usuario,
            usuarioToken: request.usuario
        });
    });
});

// Actualizar usuario
app.put('/:id', mdAutenticacion.verificarToken, (request, response) => {
    var id = request.params.id;
    var body = request.body;

    Usuario.findById(id, (error, usuario) => {
        if (error) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: error
            });
        }

        if (!usuario) {
            return response.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id ' + id + ' no existe',
                errors: { message: 'No existe un usuario con ese ID' }
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((error, usuario) => {
            if (error) {
                return response.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: error
                });
            }
            usuario.password = ':)';
            response.status(201).json({
                ok: true,
                usuario: usuario
            });
        });
    });
});

// Eiminar un usuario
app.delete('/:id', mdAutenticacion.verificarToken, (request, response) => {
    var id = request.params.id;
    Usuario.findByIdAndRemove(id, (error, usuario) => {
        if (error) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error al eliminar usuario',
                errors: error
            });
        }

        if (!usuario) {
            return response.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id ' + id + ' no existe',
                errors: { message: 'No existe un usuario con ese ID' }
            });
        }

        response.status(200).json({
            ok: true,
            usuario: usuario
        });

    });
});

module.exports = app;