module.exports = function(app) {
	var controller = app.controllers.admin.newsletterController;
  	
  	app.get('/admin/newsletter'        , controller.findAll);
  	app.get('/admin/newsletter/:id'    , controller.findById);
  	app.post('/admin/newsletter'       , controller.create );
  	app.put('/admin/newsletter'        , controller.update );
  	app.delete('/admin/newsletter/:id' , controller.destroy );
};