const express = require('express')
const http = require('http')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const sassMiddleware = require('node-sass-middleware')
const path = require('path')
const dbURL = "mongodb://localhost:27017/Hermes";
const bodyParser = require('body-parser')
const expressSession = require('express-session')
const publicPath = path.resolve(__dirname, '../public')
const port = process.env.PORT || 3000;

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(expressSession({ secret: 'max', saveUninitialized: false, resave: false }));

// handlebars config
app.engine('hbs', exphbs({
  defaultLayout: 'main',
  layoutsDir: path.join(publicPath, "views/layouts"),
  partialsDir: path.join(publicPath, "views/partials"),
  helpers: require('./config/handlebar-helpers'),
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

let server = http.createServer(app)

// BASE DE DATOS, DESACTIVAR SI NO ESTA INSTALADO MONGO
mongoose.connect(dbURL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
}, (err, res) => {
  if (err) {
    console.log('Base de datos SIN CONEXION');
    throw err;
  } else {
    console.log('Base de datos ONLINE');
  }
  
});

server.listen(port, (err) => {
  if (err) {
    throw new Error(err);
  } else {
    console.log(`Servidor corriendo en pruerto ${ port }`);
  }
})
