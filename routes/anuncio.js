module.exports = function(app) { 
	var security    = app.get("security");
	var multer      = app.get("multer");
  	var isLoggedIn  = require('./../middlewares/loginHandler');
  	var controller  = app.controllers.public.anuncioController;
  	
  	/********************************************************************************************
	 * Rotas abertas ao publico do site                                                         *
	 ********************************************************************************************/
  	app.post('/anuncio/pesquisa'     , security.forceHTTP , controller.pesquisaAnuncio);
	app.get('/anuncio/detail/:id'    , security.forceHTTP , controller.anuncioDetalheGET);
	app.get('/anuncio/lista'         , security.forceHTTP , controller.listAnuncioGET);
	app.get('/anuncio/grid'          , security.forceHTTP , controller.listAnuncioGridGET);
	
	/********************************************************************************************
	 * Rotas seguras para área administrativa do usuário restrição de segurança                 *
	 ********************************************************************************************/
	app.get( '/anuncio/meusanuncios' , isLoggedIn, security.forceHTTPS, controller.meusAnuncios);
	app.get( '/anuncio/create'       , isLoggedIn, security.forceHTTPS, controller.criarAnuncioGET);
	app.post('/anuncio/create'       , isLoggedIn, security.forceHTTPS, multer.array("fotos", 10), controller.criarAnuncioPOST);
	app.post('/anuncio/delete'    	 , isLoggedIn, security.forceHTTPS, controller.deletarAnuncio);
	app.get( '/anuncio/meusdados'    , isLoggedIn, security.forceHTTPS, controller.cadastroPerfilGET);
	app.post('/anuncio/meusdados'    , isLoggedIn, security.forceHTTPS, controller.cadastroPerfil);
};
