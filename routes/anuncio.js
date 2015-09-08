module.exports = function(app) {
  var autenticar = require('./../middlewares/loginHandler');
  	
	app.get('/anuncio/list', function(req, res, next){
		res.render('anuncio_lista');
	});

	app.get('/anuncio/grid', function(req, res, next){
		res.render('anuncio_grid');
	});

	app.get('/anuncio/detail', function(req, res, next){
		res.render('anuncio_detalhe');
	});

	app.get('/anuncio/creat', function(req, res, next){
		res.render('criar_anuncio');
	});

	app.get('/anuncio/meusanuncios', function(req, res, next){
		if(req.session.user){
		   res.render('meus_anuncios');
	  }else{
	  	res.render('login');
	  }
	});
};
