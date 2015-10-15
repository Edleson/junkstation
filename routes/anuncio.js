module.exports = function(app) {
	var security   = app.get("security");
  	var isLoggedIn = require('./../middlewares/loginHandler');
  	
	app.get('/anuncio/list', security.forceHTTP, function(req, res, next){
		res.render('anuncio_lista');
	});

	app.get('/anuncio/grid', security.forceHTTP, function(req, res, next){
		res.render('anuncio_grid');
	});

	app.get('/anuncio/detail', security.forceHTTP, function(req, res, next){
		res.render('anuncio_detalhe');
	});

	app.get('/anuncio/creat', isLoggedIn, security.forceHTTPS, function(req, res, next){
		res.render('criar_anuncio');
	});

	app.get('/anuncio/meusanuncios', isLoggedIn, security.forceHTTPS, function(req, res, next){
		res.render('meus_anuncios');
	});

	app.get('/anuncio/meusdados', isLoggedIn, security.forceHTTPS, function(req, res, next){
		res.render('meus_dados');
	});
};
