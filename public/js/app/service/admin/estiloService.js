app.factory("estiloService", function ($http) {
	var baseAdminURL = "/admin/";
	var root         = "estilo/";
	
	var _findAll = function(){
		return $http.get(baseAdminURL + root);
	};

	var _create = function(entity){
		return $http.post(baseAdminURL + root, entity);
	};

	var _update = function(entity){
		return $http.put(baseAdminURL + root, entity);
	};
	
	var _destroy = function(entity){
		return $http({method : "DELETE", url    : baseAdminURL + root + entity._id});
	};

	return {
		findAll   : _findAll 	,
		create    : _create  	,
		update    : _update  	,
		destroy   : _destroy
	};
});