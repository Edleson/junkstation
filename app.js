/***********************************************************
 * Declaração dos módulos utilizado na aplicação           *
 **********************************************************/
var express         = require('express');
var fs              = require('fs');
var load            = require('express-load')
var bodyParser      = require('body-parser');
var session         = require('express-session');
var methodOverride  = require('method-override');
var compression     = require('compression');
var path            = require('path');
var http            = require('http');
var https           = require('https');
var favicon         = require('serve-favicon');
var logger          = require('morgan');
var passport        = require("passport");
var flash           = require('connect-flash');
var cookieParser    = require('cookie-parser');
var cookie          = cookieParser();
var app             = express();

/***********************************************************
 * Carrega os midlewares que serão utilizados por toda     *
 * aplicação.                                              *
 ***********************************************************/
var context         = require('./config/context')();
var database        = require('./config/database')(context);
var _imageHandler   = require('./middlewares/imageHandler');
var _compressor     = require('./middlewares/fileMinifyHandler');
var error           = require('./middlewares/errorHandler');
var isLoggedIn      = require('./middlewares/loginHandler');
var security        = require('./middlewares/securityHandler')(context);
var emailSender     = require('./middlewares/emailHandler')(context);



/***********************************************************
 * Carrega os certificados utilizados para configuração do * 
 *https.                                                   *
 ***********************************************************/
var ssl_option      = {
  key  : fs.readFileSync(context.sec.ssl_key)  ,
  cert : fs.readFileSync(context.sec.ssl_cert)
}; 
/***********************************************************
 * Midlewares de configuração do Express                   *
 **********************************************************/
app.disable('x-powered-by');  
app.set('views', path.join(__dirname, 'views'));
app.set('view engine','ejs');
app.use(compression());
app.use(cookie);
app.use(session({ 
    secret            : context.session.secret ,
    resave            : true                   ,
    saveUninitialized : true
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public'), context.session.maxAge ));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(logger('dev'));

app.use(function(req, res, next) {
  res.locals.request  = req;
  res.locals.response = res;
  res.locals.session  = req.session;
  next();
});


app.all(['/admin*'], isLoggedIn, security.forceHTTPS);

app.set("security"    , security    );
app.set("emailSender" , emailSender );

//load('config')
  load('models')
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

/************************************************************
 * Inicializa o servidor web HTTPS                          * 
 ************************************************************/
https.createServer(ssl_option, app).listen(8443, function(){
  console.log("Junkstation started at port :" + 8443);
});

//module.exports = app;
