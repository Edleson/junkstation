module.exports = function(app) {
	var controller = app.controllers.admin.planoController;
  	
  	app.get('/admin/planos'        , controller.findAll);
  	app.get('/admin/planos/:id'    , controller.findById);
  	app.post('/admin/planos'       , controller.create );
  	app.put('/admin/planos'        , controller.update );
  	app.delete('/admin/planos/:id' , controller.destroy );
};