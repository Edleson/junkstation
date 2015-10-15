module.exports = function(app) {
	var security    = app.get("security");
	var controller  = app.controllers.public.indexController;
  	
  	app.get('/'                  , security.forceHTTP, controller.index);
  	app.get('/marca/:id/modelos' , controller.findModeloByMarca);
  	app.get('/ufs'               , controller.findUf);
};
