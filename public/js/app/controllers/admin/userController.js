app.controller('userController', function ($scope, userService, $rootScope, ngDialog) {
	$scope.entities   = [];
	var Service       = userService;
	
	var findAll = function(){
		Service.findAll().success(function(response, status){
			$scope.entities = response.data;
		}).error(function(response){
			showGrowl(response.header.error.code + " : " + response.header.error.errmsg, response.header.message,  6000);
		});
	}

	$scope.orderBy = function(ordenacao){
		$scope.ordenacao = ordenacao;
		$scope.direcao   = !$scope.direcao;
	}

	findAll();
});