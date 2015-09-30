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

  $routeProvider.when('/estilo', {
      templateUrl : 'partials/estilo.html', 
      controller  : 'estiloController',
      resolve: {
          situacoes : function(utilsService){
            return utilsService.listarSituacao();
          }
      }
  });

  $routeProvider.when('/marca', {
      templateUrl : 'partials/marca.html', 
      controller  : 'marcaController',
      resolve: {
          situacoes : function(utilsService){
            return utilsService.listarSituacao();
          }
      }
  });

  $routeProvider.when('/modelo', {
      templateUrl : 'partials/modelo.html', 
      controller  : 'modeloController',
      resolve: {
          situacoes : function(utilsService){
            return utilsService.listarSituacao();
          },

          marcas : function(marcaService){
            return marcaService.findAll();
          }
      }
  });

  $routeProvider.when('/newsletter', {
      templateUrl : 'partials/newsletter.html', 
      controller  : 'newsletterController',
      resolve: {
          situacoes : function(utilsService){
            return utilsService.listarSituacao();
          }
      }
  });

  $routeProvider.when('/servico', {
      templateUrl : 'partials/servico.html', 
      controller  : 'servicoController',
      resolve: {
          situacoes : function(utilsService){
            return utilsService.listarSituacao();
          }
      }
  });

  $routeProvider.when('/uf', {
      templateUrl : 'partials/uf.html', 
      controller  : 'ufController',
      resolve: {
          situacoes : function(utilsService){
            return utilsService.listarSituacao();
          }
      }
  });

  $routeProvider.when('/planos', {
      templateUrl : 'partials/planos.html', 
      controller  : 'planosController',
      resolve: {
          situacoes : function(utilsService){
            return utilsService.listarSituacao();
          }
      }
  });

  $routeProvider.otherwise({redirectTo: '#/'});
}]);