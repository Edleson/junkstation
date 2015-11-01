module.exports = function(app) {
	var security    = app.get("security");
	var controller  = app.controllers.public.indexController;
  	
  	app.get('/' , security.forceHTTP, controller.index);
};
