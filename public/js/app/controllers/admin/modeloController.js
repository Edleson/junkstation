
app.controller('modeloController', function ($scope, modeloService, $rootScope, ngDialog, situacoes, marcas, paginateServiceUtil, $filter) {
	$scope.entities   = [];
	$scope.entity     = {};
	$scope.situacoes  = situacoes;
	$scope.marcas     = marcas.data.data;
	$scope.paginate   = [];
	$scope.itensPerPage = 10;
	
	var Service       = modeloService;
	
	var findAll = function(){
		Service.findAll().success(function(response, status){
			var entities          = $filter('orderBy')(response.data, 'dataCricao', true);
			$scope.ordenacao      = 'dataCricao';
			$scope.direcao        = true;
			$scope.paginate       = paginateServiceUtil.paginate(entities, $scope.itensPerPage, entities.length);
			$scope.entities       = paginateServiceUtil.getPage($scope.paginate, $scope.currentPage);
			$scope.allEntities    = entities;
			$scope.entitiesLength = entities.length;
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
				showGrowl("Notificação !", "Modelo " + entity.nome + " atualizada com sucesso !", 6000);
			}).error(function(response){
				showGrowl(response.header.error.code + " : " + response.header.error.errmsg, response.header.message,  6000);
			});
		}else{
			Service.create(entity).success(function(response, status){
				delete $scope.entity;
				$scope.entityForm.$setPristine();
				findAll();
				showGrowl("Notificação !", "Modelo " + entity.nome + " criada com sucesso!", 6000);
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
            	showGrowl(null, "Modelo " + entity.nome + " excluído com sucesso !", 6000);
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

	$scope.filtered = function(){
		if($scope.filtroPesquisa){
			var pesquisa = $filter('filter')($scope.allEntities, $scope.filtroPesquisa);
			$scope.paginate = paginateServiceUtil.paginate(pesquisa, $scope.itensPerPage, $scope.entities.length);
			$scope.entities = paginateServiceUtil.getPage($scope.paginate, 1);
			$scope.entitiesLength = pesquisa.length;
			$scope.setPage(1);
		}else{
			$scope.paginate = paginateServiceUtil.paginate($scope.allEntities, $scope.itensPerPage, $scope.entities.length);
			$scope.entities = paginateServiceUtil.getPage($scope.paginate, 1);
			$scope.entitiesLength = $scope.allEntities.length;
			$scope.setPage(1);
		}
	}

	$scope.orderBy = function(ordenacao){
		$scope.ordenacao = ordenacao;
		$scope.direcao   = !$scope.direcao;
	}

	findAll();

	//PAGINAÇÃO
	$scope.maxSize = 5;
	$scope.currentPage = 1;
	$scope.setPage = function (pageNo) {
		$scope.currentPage = pageNo;
	};

	$scope.pageChanged = function() {
		$scope.entities = paginateServiceUtil.getPage($scope.paginate, $scope.currentPage);
	};
});