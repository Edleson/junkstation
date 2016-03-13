module.exports = function(app) { 
	var security    = app.get("security");
	var multer      = app.get("multer");
  	var isLoggedIn  = require('./../middlewares/loginHandler');
  	var controller  = app.controllers.public.anuncioController;
  	var uploadOptions = [
  							{name : "fotos"         , maxCount : 20}			,
  						 	{name : "fotoPrincipal" , maxCount : 1 }
  						];
  	
  	/********************************************************************************************
	 * Rotas abertas ao publico do site                                                         *
	 ********************************************************************************************/
  	app.get('/anuncio/pesquisa'      , security.forceHTTP , controller.pesquisaAnuncio);
	app.get('/anuncio/detail/:id'    , security.forceHTTP , controller.anuncioDetalheGET);
	app.get('/anuncio/lista'         , security.forceHTTP , controller.listAnuncioGET);
	app.get('/anuncio/grid'          , security.forceHTTP , controller.listAnuncioGridGET);
	app.post('/anuncio/:id/proposta' , security.forceHTTP , controller.cadastroProposta);
	
	/********************************************************************************************
	 * Rotas seguras para área administrativa do usuário restrição de segurança                 *
	 ********************************************************************************************/
	app.get( '/anuncio/meusanuncios'     , isLoggedIn, security.forceHTTPS, controller.meusAnuncios);
	app.get( '/anuncio/create'           , isLoggedIn, security.forceHTTPS, controller.criarAnuncioGET);
	app.get( '/anuncio/:id/edit'  	     , isLoggedIn, security.forceHTTPS, controller.editAnuncioGET);
	app.get( '/anuncio/:id/mensagem'  	 , isLoggedIn, security.forceHTTPS, controller.anuncioMensagem);
	app.get( '/anuncio/:id/remove/media' , isLoggedIn, security.forceHTTPS, controller.deletarFoto);
	app.post('/anuncio/edit'  	         , isLoggedIn, security.forceHTTPS, multer.fields(uploadOptions),  controller.editAnuncioPOST);
	app.post('/anuncio/create'           , isLoggedIn, security.forceHTTPS, multer.array("fotos", 20), controller.criarAnuncioPOST);
	app.post('/anuncio/delete'    	     , isLoggedIn, security.forceHTTPS, controller.deletarAnuncio);
	app.get( '/anuncio/meusdados'        , isLoggedIn, security.forceHTTPS, controller.cadastroPerfilGET);
	app.post('/anuncio/meusdados'        , isLoggedIn, security.forceHTTPS, controller.cadastroPerfilPOST);
};
