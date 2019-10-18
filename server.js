const express = require('express')
const exphbs = require('express-handlebars')
const sassMiddleware = require('node-sass-middleware')
const http = require('http')
const mongoose = require('mongoose')
const path = require('path')

const app = express()

const bodyParser = require('body-parser')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

let server = http.createServer(app)

const port = process.env.PORT || 3000;

// sass config
app.use(
  sassMiddleware({
    src: __dirname + '/sass',
    dest: __dirname,
    debug: true,
    outputStyle: 'compressed'
  })
)

// handlebars config
app.engine('hbs', exphbs({
  extname: '.hbs',
  defaultLayout: 'index'
}))
app.set('view engine', 'hbs')

// main view
app.get('/', function (req, res) {
  res.render('home');
});

app.use(require('./server/routes'))

// BASE DE DATOS, DESACTIVAR SI NO ESTA INSTALADO MONGO
mongoose.connect("mongodb://localhost:27017/Hermes", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
}, (err, res) => {
  if (err) throw err;
  console.log('Base de datos ONLINE');
});

server.listen(port, (err) => {
  if (err) throw new Error(err);
  console.log(`Servidor corriendo en puerto ${ port }`);
})
