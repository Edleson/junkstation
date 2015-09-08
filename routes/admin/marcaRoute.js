module.exports = function(app) {
	var controller       = app.controllers.admin.marcaController;
	var modeloController = app.controllers.admin.modeloController;
  	
  	app.get('/admin/marca'             , controller.findAll);
  	app.get('/admin/marca/:id'    	   , controller.findById);
  	app.get('/admin/marca/:id/modelos' , modeloController.findByMarca);
  	app.post('/admin/marca'            , controller.create );
  	app.put('/admin/marca'             , controller.update );
  	app.delete('/admin/marca/:id'      , controller.destroy );
};