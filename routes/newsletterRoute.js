module.exports = function(app) {
	var security    = app.get("security");
	var controller  = app.controllers.public.newsletterController;
  	
  	app.post('/newsletter/create'     , security.forceHTTP, controller.create);
  	app.get('/newsletter/delete/:id'  , security.forceHTTPS, controller.remove);
};