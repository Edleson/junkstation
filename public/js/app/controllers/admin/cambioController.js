
app.controller('cambioController', function ($scope, cambioService, $rootScope, ngDialog, situacoes) {
	$scope.entities   = [];
	$scope.entity     = {};
	$scope.situacoes  = situacoes;
	var Service       = cambioService;
	
	var findAll = function(){
		Service.findAll().success(function(response, status){
			$scope.entities = response.data;
		}).error(function(response){
			showGrowl(response.header.error.code + " : " + response.header.error.errmsg, response.header.message,  6000);
		});
	}

	$scope.createOrUpdate = function(entity){
		showBlockUI({message : "Carregando ..."}); 
		if(entity._id){
			Service.update(entity).success(function(response, status){
				delete $scope.entity;
				$scope.entityForm.$setPristine();
				findAll();
				showGrowl("Notificação !", "Câmbio " + entity.nome + " atualizada com sucesso !", 6000);
			}).error(function(response){
				showGrowl(response.header.error.code + " : " + response.header.error.errmsg, response.header.message,  6000);
			});
		}else{
			Service.create(entity).success(function(response, status){
				delete $scope.entity;
				$scope.entityForm.$setPristine();
				findAll();
				showGrowl("Notificação !", "Câmbio " + entity.nome + " criada com sucesso!", 6000);
			}).error(function(response){
				showGrowl(response.header.error.code + " : " + response.header.error.errmsg, response.header.message,  6000);
			});
		}
	};

	$scope.destroy = function(entity){
		ngDialog.openConfirm({
            template  : 'modalDialogId',
            className : 'ngdialog-theme-default'
        }).then(function (value) {
            Service.destroy(entity).success(function(response, status){
            	showGrowl(null, "Câmbio " + entity.nome + " excluído com sucesso !", 6000);
				delete $scope.entity;
				findAll();	
			}).error(function(response){
				showGrowl(response.header.error.code + " : " + response.header.error.errmsg, response.header.message,  6000);	
			});	
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });
	};

	$scope.selectEntity = function(entity){
		$scope.entity = angular.copy(entity);
	};

	$scope.orderBy = function(ordenacao){
		$scope.ordenacao = ordenacao;
		$scope.direcao   = !$scope.direcao;
	}

	findAll();
});