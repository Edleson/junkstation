module.exports = function(app) {
	var controller = app.controllers.admin.anuncioController;
  	
  	app.get('/admin/anuncio/list'       , controller.listaAnuncios);
  	app.get('/admin/anuncio/anunciante' , controller.listaAnunciantes);
  	
};