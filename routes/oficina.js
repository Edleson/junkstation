module.exports = function(app) {
	var security    = app.get("security");
	var isLoggedIn  = require('./../middlewares/loginHandler');
	var controller  = app.controllers.public.oficinaController;
  	
  	app.get('/oficina'  , isLoggedIn, security.forceHTTPS, controller.index);

};