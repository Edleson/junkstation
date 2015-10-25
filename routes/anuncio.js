module.exports = function(app) {
	var security   = app.get("security");
  	var isLoggedIn = require('./../middlewares/loginHandler');
  	var controller = app.controllers.public.anuncioController;
  	
	app.get('/anuncio/list', security.forceHTTP, function(req, res, next){
		res.render('anuncio_lista');
	});

	app.get('/anuncio/grid', security.forceHTTP, function(req, res, next){
		res.render('anuncio_grid');
	});

	app.get('/anuncio/detail', security.forceHTTP, function(req, res, next){
		res.render('anuncio_detalhe');
	});

	

	app.get('/anuncio/meusanuncios', isLoggedIn, security.forceHTTPS, function(req, res, next){
		res.render('meus_anuncios');
	});

	app.get('/anuncio/create'    , isLoggedIn, security.forceHTTPS, controller.criarAnuncioGET  );
	app.get('/anuncio/meusdados' , isLoggedIn, security.forceHTTPS, controller.cadastroPerfilGET);
	app.post('/anuncio/meusdados', isLoggedIn, security.forceHTTPS, controller.cadastroPerfil   );
};
