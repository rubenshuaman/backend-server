// Requires
var express = require('express');
var mongoose = require('mongoose');

// Inicializar variable
var app = express();

// conexion a db
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (error, response) => {
    if (error) {
        throw error;
    }
    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
});


// Rutas
app.get('/', (request, response, next) => {
    response.status(200).json({
        mensaje: 'Peticion realaizada correctamente'
    });
});

// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});