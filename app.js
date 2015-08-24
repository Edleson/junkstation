/***********************************************************
 * Declaração dos módulos utilizado na aplicação           *
 **********************************************************/
var express       = require('express');
var path          = require('path');
var favicon       = require('serve-favicon');
var logger        = require('morgan');
var cookieParser  = require('cookie-parser');
var bodyParser    = require('body-parser');
var session       = require('express-session');

/***********************************************************
 * Importa todas as rotas da aplicação                     *
 **********************************************************/
var routes        = require('./routes/index');
var anuncio       = require('./routes/anuncio');
var servico       = require('./routes/servico');
var contato       = require('./routes/contato');
var sobre         = require('./routes/sobre');
var upload        = require('./routes/upload');
var login         = require('./routes/login');
var logout        = require('./routes/logout');
var planos        = require('./routes/planos');

/***********************************************************
 * Instancia o módulo do Express                           *
 **********************************************************/
var app           = express();

/***********************************************************
 * Midlewares de configuração do Express                   *
 **********************************************************/
app.set('views', path.join(__dirname, 'views'));
app.set('view engine','ejs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ 
    secret : 'AKIAJSYCYDPOCPUJOYQA',
    resave : true,
    saveUninitialized: true
  }
));

/***********************************************************
 * Essa função disponibiliza nas Views algumas variáveis   *
 *no escopo das páginas (ejs)                              *
 **********************************************************/
app.use(function (req, res, next) {
  res.locals.request  = req;
  res.locals.response = res;
  res.locals.session  = req.session;
  next();
});

/***********************************************************
 * Inclui todas as rotas no módulo Express                 *
 ***********************************************************/
app.use('/'         , routes);
app.use('/anuncio'  , anuncio);
app.use('/servico'  , servico);
app.use('/contato'  , contato);
app.use('/sobre'    , sobre);
app.use('/upload'   , upload);
app.use('/login'    , login);
app.use('/logout'   , logout);
app.use('/planos'   , planos);

/***********************************************************
 * Manipula os erro 404 (Page Not Found)                   *
 ***********************************************************/
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/***********************************************************
 * Manipulador de erros no ambiente de Desenvolvimento     *
 ***********************************************************/
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

/***********************************************************
 * Manipulador de erros no ambiente de Produção            *
 ***********************************************************/
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
