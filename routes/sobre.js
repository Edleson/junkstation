module.exports = function(app) {
	var autenticar = require('./../middlewares/loginHandler');
  	
  	app.get('/sobre', function(req, res, next){
  		res.render('sobre');
  	});
};
