app.config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
    //$httpProvider.interceptors.push('meuInterceptor');
    console.log("initialazer angular webapp");
    $routeProvider.when('/', {
      templateUrl: 'partials/homeAdmin.html', 
      controller: 'adminController'
    });

   $routeProvider.when('/categoria', {
      templateUrl: 'partials/categoria.html', 
      controller: 'categoriaController'
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