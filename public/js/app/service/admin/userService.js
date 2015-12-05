app.factory("userService", function ($http) {
	var baseAdminURL = "/admin/";	
	var root         = "users/";
	
	var _findAll = function(){
		return $http.get(baseAdminURL + root);
	};

	var _update = function(entity){
		return $http.put(baseAdminURL + root, entity);
	};
	
	var _destroy = function(entity){
		return $http({method : "DELETE", url : baseAdminURL + root + entity._id});
	};

	return {
		findAll   : _findAll 	,
		update    : _update  	,
		destroy   : _destroy
	};
});