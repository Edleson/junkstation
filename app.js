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
var Imagemin      = require('imagemin');
var compressor    = require('node-minify');
var compression   = require('compression');

/***********************************************************
 *  Inicia as configurações do banco de dados              *
 **********************************************************/
var database      = require('./config/database')();

/***********************************************************
 * Importa todos os Models da aplicação                    *
 **********************************************************/
var Marca         = require('./models/Marca')();
var Categoria     = require('./models/categoria')();


//console.log(Categoria);

/*var teste = {nome : "TESTE", marcas : []}
Categoria.create(teste).then(
  function(marca){
    console.log(marca);
  },

  function(err){
    console.log(err);
  }
);*/

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

var admin         = require('./routes/admin');

/***********************************************************
 * Instancia o módulo do Express                           *
 **********************************************************/
var app           = express();

/***********************************************************
 * Faz a compressão do HTML                                *
 ***********************************************************/
app.use(compression());
/***********************************************************
 * Midlewares de configuração do Express                   *
 **********************************************************/
app.set('views', path.join(__dirname, 'views'));
app.set('view engine','ejs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 86400000 }));
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
app.use('/admin'    , admin);

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

/************************************************************
 * Essa módulo é responsável por tratas as imagens que estão *
 *localizadas na pasta public/images e geram novas imagens   *
 *otimizadas para web                                        *
 ***********************************************************/
var imagezip = new Imagemin();
imagezip.src('public/real_images/*.{gif,jpg,png,svg}')
    .dest('public/dist/images')
    .use(Imagemin.jpegtran({progressive: true}))
    .use(Imagemin.gifsicle({interlaced: true}))
    .use(Imagemin.optipng({optimizationLevel: 3}))
    .use(Imagemin.svgo())
    .run(function (err, files) {
        if(err){
          //console.log("Ocorreu um erro durante a geração das imagens otimizadas." , err);
        }
    });

var imagezip2 = new Imagemin();
imagezip2.src('public/real_images/fancybox/*.{gif,jpg,png,svg}')
    .dest('public/dist/images/fancybox')
    .use(Imagemin.jpegtran({progressive: true}))
    .use(Imagemin.gifsicle({interlaced: true}))
    .use(Imagemin.optipng({optimizationLevel: 3}))
    .use(Imagemin.svgo())
    .run(function (err, files) {
        if(err){
         // console.log("Ocorreu um erro durante a geração das imagens otimizadas." , err);
        }
    });

var imagezip3 = new Imagemin();
imagezip3.src('public/real_images/junkcars/*.{gif,jpg,png,svg}')
    .dest('public/dist/images/junkcars')
    .use(Imagemin.jpegtran({progressive: true}))
    .use(Imagemin.gifsicle({interlaced: true}))
    .use(Imagemin.optipng({optimizationLevel: 3}))
    .use(Imagemin.svgo())
    .run(function (err, files) {
        if(err){
        //  console.log("Ocorreu um erro durante a geração das imagens otimizadas." , err);
        }
    });

var imagezip4 = new Imagemin();
imagezip4.src('public/real_images/revslider/*.{gif,jpg,png,svg}')
    .dest('public/dist/images/revslider')
    .use(Imagemin.jpegtran({progressive: true}))
    .use(Imagemin.gifsicle({interlaced: true}))
    .use(Imagemin.optipng({optimizationLevel: 3}))
    .use(Imagemin.svgo())
    .run(function (err, files) {
        /*for(prop in files[0]){
          console.log("file." + prop + " = " + files[0][prop]);
        }*/
        if(err){
        //  console.log("Ocorreu um erro durante a geração das imagens otimizadas." , err);
        }
    });

/***********************************************************
 * Faz a mimificação de todos os arquivos css do projeto   * 
 ***********************************************************/
new compressor.minify({
    type: 'yui-css',
    fileIn: [
              'public/css/font-awesome.css',
              'public/css/icomoon.css',
              'public/css/font-awesome.css',
              'public/css/jquery.fancybox-1.3.4.css',
              'public/css/revslider.css',
              'public/css/style.css',
              'public/css/planos.css',
              'public/css/responsive.css'
            ],
    fileOut: 'public/dist/css/base-min.css',
    callback: function(err, min){
        //console.log(err);
    }
});

new compressor.minify({
    type: 'yui-js'                                                ,
    fileIn: [
              'public/js/lib/angular.min.js'                      ,
              'public/js/lib/angular-resource.min.js'             ,
              'public/js/lib/angular-route.min.js'                ,
              'public/js/lib/jquery-1.9.1.min.js'                 ,
              'public/js/lib/superfish.js'                        ,
              'public/js/lib/jquery.themepunch.plugins.min.js'    ,
              'public/js/lib/jquery.themepunch.revolution.min.js' ,
              'public/js/lib/form_style.js'                       ,
              'public/js/lib/bootstrap.min.js'                    ,
              'public/js/lib/jquery.placeholder.min.js'           ,
              'public/js/lib/jquery.fancybox-1.3.4.js'            ,
              'public/js/lib/jquery.gmap.min.js'                  ,
              'public/js/lib/custom.js'
            ],
    fileOut: 'public/dist/js/core-min.js'                         ,
    callback: function(err, min){
      console.log(err);
    }
});

new compressor.minify({
    type: 'yui-js'                                                ,
    fileIn: [
              'public/js/app/app.js'                                        ,
              'public/js/app/controllers/adminController.js'                ,
              'public/js/app/controllers/admin/categoriaController.js'      ,
              'public/js/app/controllers/admin/ui/uiController.js'          ,
              'public/js/app/routes/adminRoutes.js'               
                  
              

            ],
    fileOut: 'public/dist/js/app-min.js'                          ,
    callback: function(err, min){
      console.log(err);
    }
});

module.exports = app;
