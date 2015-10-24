
function listMarca(callback, params, showGifLoad){
	var request =  {
		url      : "/dominio/marca" ,
		params   : params | {}   ,
		method   : "get"       	 ,
		callback : callback
	};

	ajaxRequest(request, showGifLoad);
}

function listModeloByMarca(idMarca, callback, params, showGifLoad){
	var request =  {
		url      : "/dominio/marca/" + idMarca + "/modelo" ,
		params   : params | 	{}   				 	   ,         
		method   : "get"       					           ,
		callback : callback
	};

	ajaxRequest(request, showGifLoad);
}

function listAnoFabricacao(callback, params, showGifLoad){
	var request =  {
		url      : "/dominio/anofabricacao" ,
		params   : params | {}   ,
		method   : "get"       	 ,
		callback : callback
	};

	ajaxRequest(request, showGifLoad);
}

function listCambio(callback, params, showGifLoad){
	var request =  {
		url      : "/dominio/cambio" ,
		params   : params | {}   ,
		method   : "get"       	 ,
		callback : callback
	};

	ajaxRequest(request, showGifLoad);
}

function listCor(callback, params, showGifLoad){
	var request =  {
		url      : "/dominio/cor" ,
		params   : params | {}   ,
		method   : "get"       	 ,
		callback : callback
	};

	ajaxRequest(request, showGifLoad);

}

function listCategoria(callback, params, showGifLoad){
	var request =  {
		url      : "/dominio/categoria" ,
		params   : params | {}   ,
		method   : "get"       	 ,
		callback : callback
	};

	ajaxRequest(request, showGifLoad);

}

function listCombustivel(callback, params, showGifLoad){
	var request =  {
		url      : "/dominio/combustivel" ,
		params   : params | {}   ,
		method   : "get"       	 ,
		callback : callback
	};

	ajaxRequest(request, showGifLoad);

}

function listUF(callback, params, showGifLoad){
	var request =  {
		url      : "/dominio/uf" ,
		params   : params | {}   ,
		method   : "get"       	 ,
		callback : callback
	};

	ajaxRequest(request, showGifLoad);
}

function listEstilo(callback, params, showGifLoad){
	var request =  {
		url      : "/dominio/estilo" ,
		params   : params | {}   ,
		method   : "get"       	 ,
		callback : callback
	};

	ajaxRequest(request, showGifLoad);
}