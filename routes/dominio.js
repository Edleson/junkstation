module.exports = function(app) {
	var security   = app.get("security");
  	var controller = app.controllers.public.dominioController;
  	
	app.get('/dominio/marca'            , controller.listMarca);
	app.get('/dominio/marca/:id/modelo' , controller.listModeloByMarca);
	app.get('/dominio/anofabricacao'    , controller.listAnoFabricacao);
	app.get('/dominio/cambio'           , controller.listCambio);
	app.get('/dominio/cor'              , controller.listCor);
	app.get('/dominio/categoria'        , controller.listCategoria);
	app.get('/dominio/combustivel'      , controller.listCombustivel);
	app.get('/dominio/uf'               , controller.listUf);
	app.get('/dominio/estilo'           , controller.listEstilo);	

	
};
