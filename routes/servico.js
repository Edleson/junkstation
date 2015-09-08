module.exports = function(app) {
	var autenticar = require('./../middlewares/loginHandler');
  	
  	app.get('/servico', function(req, res, next){
  		res.render('servico');
  	});
};
