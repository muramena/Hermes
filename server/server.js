const express = require('express')
const http = require('http')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const sassMiddleware = require('node-sass-middleware')
const path = require('path')

const app = express()
const dbURL = "mongodb://localhost:27017/Hermes";

const bodyParser = require('body-parser')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json())

let server = http.createServer(app)

const publicPath = path.resolve(__dirname, '../public')
const port = process.env.PORT || 3000;

// handlebars config
app.engine('hbs', exphbs({
  layoutsDir: path.join(publicPath, "views/layouts"),
  defaultLayout: 'main',
  extname: '.hbs'
}));

app.set('view engine', 'hbs');

// sass config
app.use(
  sassMiddleware({
    src: path.resolve(__dirname, '../sass'),
    dest: publicPath,
    debug: true
  })
);   

app.use(express.static(publicPath))

app.use(require('./routes'))
app.use(require('./routes/views'))

// BASE DE DATOS, DESACTIVAR SI NO ESTA INSTALADO MONGO
mongoose.connect(dbURL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
}, (err, res) => {
  if (err) {
    throw err;
  } else {
    console.log('Base de datos ONLINE');
  }
  
  server.listen(port, (err) => {
    if (err) {
      throw new Error(err);
    } else {
      console.log(`Servidor corriendo en pruerto ${ port }`);
    }
  })
});
