app.factory("anuncioService", function ($http) {
	var baseAdminURL = "/admin/";
	var root         = "anuncio/";
	
	var _findAll = function(){
		return $http.get(baseAdminURL + root + "list");
	};

	var _findAllAnunciantes = function(){
		return $http.get(baseAdminURL + root + "anunciante");
	};
	return {
		findAll             : _findAll 				,
		findAllAnunciantes  : _findAllAnunciantes
	//	create    : _create  	,
	//	update    : _update  	,
	//	destroy   : _destroy
	};
});