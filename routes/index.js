module.exports = function(app) {
	var autenticar = require('./../middlewares/loginHandler');
  	
  	app.get('/', function(req, res, next){
  		res.render('index');
  	});
};
