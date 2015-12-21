module.exports = function(app) {
	var security    = app.get("security");
	var controller  = app.controllers.public.pagseguroController;
  	
  	app.get('/pagseguro/notificacao'  , controller.index);
  	app.post('/pagseguro/notificacao' , controller.index);

  	app.get('/pagseguro/success'  , controller.success);
  	app.post('/pagseguro/success' , controller.success);
  	
};