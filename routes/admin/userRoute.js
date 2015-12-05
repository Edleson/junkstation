module.exports = function(app) {
	var controller = app.controllers.admin.userController;
  	
  	app.get('/admin/users'        , controller.findAll);
  	app.get('/admin/users/:id'    , controller.findById);
  	app.put('/admin/users'        , controller.update );
  	app.delete('/admin/users/:id' , controller.destroy );
};