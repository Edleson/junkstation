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

	$scope.isAdmin = function(user){
		if(user){
			var isAdmin = user.perfil.filter(function(item){
				return item === "ADMIN";
			});
			return isAdmin.length > 0;
		}else{
			return false;
		}
	}

	$scope.removeAdmin = function(user){
		var notAdmin = {};
		notAdmin._id = user._id;
		notAdmin.perfil = user.perfil.filter(function(item){
			return item !== "ADMIN";
		});
		user.perfil = notAdmin.perfil;
		Service.update(notAdmin);
		findAll();
	}

	$scope.addAdmin = function(user){
		var admin = {};
		admin._id = user._id;
		admin.perfil = user.perfil;
		admin.perfil.push("ADMIN");
		Service.update(admin);
		findAll();
	}

	findAll();
});