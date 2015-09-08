module.exports = function(app) {
	var controller = app.controllers.admin.cambioController;
  	
  	app.get('/admin/cambio'        , controller.findAll);
  	app.get('/admin/cambio/:id'    , controller.findById);
  	app.post('/admin/cambio'       , controller.create );
  	app.put('/admin/cambio'        , controller.update );
  	app.delete('/admin/cambio/:id' , controller.destroy );
};