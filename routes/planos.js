module.exports = function(app) {
	var security   = app.get("security");
	
	var controller = app.controllers.public.planosController;
  	
  	app.get('/planos', security.forceHTTP, controller.index);
};