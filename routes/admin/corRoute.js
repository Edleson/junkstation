module.exports = function(app) {
	var controller = app.controllers.admin.corController;
  	
  	app.get('/admin/cor'        , controller.findAll);
  	app.get('/admin/cor/:id'    , controller.findById);
  	app.post('/admin/cor'       , controller.create );
  	app.put('/admin/cor'        , controller.update );
  	app.delete('/admin/cor/:id' , controller.destroy );
};