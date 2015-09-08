module.exports = function(app) {
	var controller = app.controllers.admin.anoFabricacaoController;
  	
  	app.get('/admin/anoFabricacao'        , controller.findAll);
  	app.get('/admin/anoFabricacao/:id'    , controller.findById);
  	app.post('/admin/anoFabricacao'       , controller.create );
  	app.put('/admin/anoFabricacao'        , controller.update );
  	app.delete('/admin/anoFabricacao/:id' , controller.destroy );
};