module.exports = function(app) {
	var controller = app.controllers.admin.ufController;
  	
  	app.get('/admin/uf'        , controller.findAll);
  	app.get('/admin/uf/:id'    , controller.findById);
  	app.post('/admin/uf'       , controller.create );
  	app.put('/admin/uf'        , controller.update );
  	app.delete('/admin/uf/:id' , controller.destroy );
};