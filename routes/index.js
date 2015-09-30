module.exports = function(app) {
	//var autenticar  = require('./../middlewares/loginHandler');
	var controller  = app.controllers.public.indexController;
  	
  	app.get('/', controller.index);
};
