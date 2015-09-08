module.exports = function(app) {
	var controller = app.controllers.admin.servicoController;
  	
  	app.get('/admin/servico'        , controller.findAll);
  	app.get('/admin/servico/:id'    , controller.findById);
  	app.post('/admin/servico'       , controller.create );
  	app.put('/admin/servico'        , controller.update );
  	app.delete('/admin/servico/:id' , controller.destroy );
};