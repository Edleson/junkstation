module.exports = function(app) {
	var autenticar = require('./../middlewares/loginHandler');
  	
  	app.get('/planos', function(req, res, next){
  		 res.render("planos");
  	});
};