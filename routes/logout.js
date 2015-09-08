module.exports = function(app) {
	var autenticar = require('./../middlewares/loginHandler');
  	
  	app.get('/logout', function(req, res, next){
  		req.session.destroy();
  		res.redirect("/");
  	});
};