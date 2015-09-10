module.exports = function(app) {
	var controller = app.controllers.admin.estiloController;
  	
  	app.get('/admin/estilo'        , controller.findAll);
  	app.get('/admin/estilo/:id'    , controller.findById);
  	app.post('/admin/estilo'       , controller.create );
  	app.put('/admin/estilo'        , controller.update );
  	app.delete('/admin/estilo/:id' , controller.destroy );
};