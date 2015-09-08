module.exports = function(app) {
	var controller = app.controllers.admin.combustivelController;
  	
  	app.get('/admin/combustivel'        , controller.findAll);
  	app.get('/admin/combustivel/:id'    , controller.findById);
  	app.post('/admin/combustivel'       , controller.create );
  	app.put('/admin/combustivel'        , controller.update );
  	app.delete('/admin/combustivel/:id' , controller.destroy );
};