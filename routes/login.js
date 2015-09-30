module.exports = function(app) {
	var autenticar = require('./../middlewares/loginHandler');
  	
	app.get('/login', function(req, res, next){
		res.render('login');
	});

	app.post('/login', function(req, res, next){
		var user          = {};
 	  	user.email        = req.body.email;
  		user.password     = req.body.password;
  		req.session.user  = user;
  		res.redirect("/anuncio/meusanuncios");
	});
};

