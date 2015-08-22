app.config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
    //$httpProvider.interceptors.push('meuInterceptor');
    console.log("initialazer angular webapp");
    $routeProvider.when('/', {
      templateUrl: 'views/home.html', 
      controller: 'homeController'
    });

    $routeProvider.when('/anuncio/list', {
      templateUrl: 'views/lista_anuncios.html', 
      controller: 'homeController'
    });

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
    });

    
    $routeProvider.otherwise({redirectTo: '/'});
}]);