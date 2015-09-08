module.exports = function(app) {
	var controller = app.controllers.admin.modeloController;
  	
  	app.get('/admin/modelo'        , controller.findAll);
  	app.get('/admin/modelo/:id'    , controller.findById);
  	app.post('/admin/modelo'       , controller.create );
  	app.put('/admin/modelo'        , controller.update );
  	app.delete('/admin/modelo/:id' , controller.destroy );
};