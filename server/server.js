const express = require('express')
const http = require('http')
const mongoose = require('mongoose');

const path = require('path')

const app = express()

const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

let server = http.createServer(app)

const publicPath = path.resolve(__dirname, '../public')
const port = process.env.PORT || 3000;

app.use(express.static(publicPath))

app.use(require('./routes'))

// BASE DE DATOS, DESACTIVAR SI NO ESTA INSTALADO MONGO
mongoose.connect("mongodb://localhost:27017/Hermes", { useNewUrlParser: true, useCreateIndex: true }, (err, res) => {
    if (err) throw err;
    console.log('Base de datos ONLINE');
});

server.listen(port, (err) => {
    if (err) throw new Error(err);
    console.log(`Servidor corriendo en puerto ${ port }`);
})
