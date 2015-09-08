/***********************************************************
 * Declaração dos módulos utilizado na aplicação           *
 **********************************************************/
var express         = require('express');
var cfg             = require('./config.json');
var load            = require('express-load')
var bodyParser      = require('body-parser');
var cookieParser    = require('cookie-parser');
var session         = require('express-session');
var methodOverride  = require('method-override');
var error           = require('./middlewares/errorHandler');
var compression     = require('compression');
var cookie          = cookieParser();
var path            = require('path');
var app             = express();
var http            = require('http');
var favicon         = require('serve-favicon');
var logger          = require('morgan');
var _imageHandler   = require('./middlewares/imageHandler');
var _compressor     = require('./middlewares/fileMinifyHandler');

/***********************************************************
 * Midlewares de configuração do Express                   *
 **********************************************************/
app.disable('x-powered-by');  
app.set('views', path.join(__dirname, 'views'));
app.set('view engine','ejs');
app.use(compression());
app.use(cookie);
app.use(session({ 
    secret            : 'AKIAJSYCYDPOCPUJOYQA'     ,
    resave            : true                       ,
    saveUninitialized : true
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public'), cfg.CACHE ));



app.use(function(req, res, next) {
  res.locals.request  = req;
  res.locals.response = res;
  res.locals.session  = req.session;
  next();
});
app.use(logger('dev'));

load('config')
  .then('models')
  .then('controllers')
  .then('routes')
  .into(app);


app.use(error.notFound);
app.use(error.serverError);

/***********************************************************
 * Faz otimização das imagens e coloca no diretório DIST   * 
 ***********************************************************/
_imageHandler();

/************************************************************
 * Faz a mimificação dos JSs e CSS e concatena em um arquivo* 
 ************************************************************/
_compressor();

/************************************************************
 * Inicializa o servidor web.                               * 
 ************************************************************/
http.createServer(app).listen(3000, function(){
  console.log("Junkstation started at port :" + 3000);
});

//module.exports = app;
