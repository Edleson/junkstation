module.exports = function(app) {
	var security    = app.get("security");
	var isLoggedIn  = require('./../middlewares/loginHandler');
	var controller  = app.controllers.public.assinaturaController;
	
  	app.get( '/assinatura/listar'          ,  isLoggedIn, security.forceHTTPS, controller.listarAssinaturaByUser);
  	app.get( '/assinatura/detalhe/:id'     ,  isLoggedIn, security.forceHTTPS, controller.findAssinaturaById);
  	app.post('/assinatura/renovar/:id'         ,  isLoggedIn, security.forceHTTPS, controller.renovarAssinatura);
  	app.get('/assinatura/cancelar/:id'     ,  isLoggedIn, security.forceHTTPS, controller.cancelarAssinatura);
  	app.post('/assinatura/create'          ,  isLoggedIn, security.forceHTTPS, controller.criarAssinatura);
  	app.get('/assinatura/create/:planoID'  ,  security.forceHTTPS, controller.criarAssinaturaOneClick);
};
