module.exports = function(app) {
	//var autenticar = require('./../../middlewares/loginHandler');
  	
  	app.get('/admin', function(req, res, next){
  		res.render('admin/home');
  	});
};
