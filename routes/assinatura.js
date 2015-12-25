module.exports = function(app) {
	var security    = app.get("security");
	var isLoggedIn  = require('./../middlewares/loginHandler');
	var controller  = app.controllers.public.assinaturaController;
	
  	app.get( '/assinatura/listar'  ,  isLoggedIn, security.forceHTTPS, controller.listarAssinaturaByUser);
  	app.get( '/assinatura/detalhe' ,  isLoggedIn, security.forceHTTPS, controller.findAssinaturaById);
  	app.post('/assinatura/renovar' ,  isLoggedIn, security.forceHTTPS, controller.renovarAssinatura);
};