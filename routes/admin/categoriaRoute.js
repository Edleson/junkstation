module.exports = function(app) {
	var controller = app.controllers.admin.categoriaController;
  	
  	app.get('/admin/categoria'        , controller.findAll);
  	app.get('/admin/categoria/:id'    , controller.findById);
  	app.post('/admin/categoria'       , controller.create );
  	app.put('/admin/categoria'        , controller.update );
  	app.delete('/admin/categoria/:id' , controller.destroy );
};