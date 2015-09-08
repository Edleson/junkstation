app.config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
  //$httpProvider.interceptors.push('meuInterceptor');
  $routeProvider.when('/', {
      templateUrl : 'partials/homeAdmin.html', 
      controller  : 'adminController'
    }
  );

  $routeProvider.when('/anoFabricacao', {
      templateUrl : 'partials/anoFabricacao.html', 
      controller  : 'anoFabricacaoController',
      resolve: {
          situacoes : function(utilsService){
            return utilsService.listarSituacao();
          }
      }
  });

  $routeProvider.when('/cambio', {
      templateUrl : 'partials/cambio.html', 
      controller  : 'cambioController',
      resolve: {
          situacoes : function(utilsService){
            return utilsService.listarSituacao();
          }
      }
  });

  $routeProvider.when('/categoria', {
      templateUrl : 'partials/categoria.html', 
      controller  : 'categoriaController',
      resolve: {
          situacoes : function(utilsService){
            return utilsService.listarSituacao();
          }
      }
  });

  $routeProvider.when('/combustivel', {
      templateUrl : 'partials/combustivel.html', 
      controller  : 'combustivelController',
      resolve: {
          situacoes : function(utilsService){
            return utilsService.listarSituacao();
          }
      }
  });

  $routeProvider.when('/cor', {
      templateUrl : 'partials/cor.html', 
      controller  : 'corController',
      resolve: {
          situacoes : function(utilsService){
            return utilsService.listarSituacao();
          }
      }
  });

  


    /* 
    $routeProvider.when('/contato', {
      templateUrl: 'views/contato.html', 
      controller: 'homeController'
    });

    $routeProvider.when('/servicos', {
      templateUrl: 'views/servicos.html', 
      controller: 'homeController'
    });

    $routeProvider.when('/sobre', {
      templateUrl: 'views/sobre.html', 
      controller: 'homeController'
    });

    $routeProvider.when('/anuncio/grid', {
      templateUrl: 'views/grid_anuncios.html', 
      controller: 'homeController'
    });

    $routeProvider.when('/anuncio/detail', {
      templateUrl: 'views/detalhe_anuncio.html', 
      controller: 'homeController'
    });*/

    
    $routeProvider.otherwise({redirectTo: '/'});
}]);