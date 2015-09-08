module.exports = function(app) {
	var autenticar = require('./../middlewares/loginHandler');
  	
  	app.get('/contato', function(req, res, next){
  		res.render('contato');
  	});
};
