var express = require('express');

var app = express();

app.get('/', (request, response, next) => {
    response.status(200).json({
        mensaje: 'Peticion realaizada correctamente'
    });
});

module.exports = app;