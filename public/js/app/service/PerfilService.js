/* global angular */
angular.module('junkstation').factory('Perfil', function($resource){
    return $resource('/api/perfil/:id');
});


angular.module('junkstation').factory('Logado', function($resource){
    return $resource('/api/logado/:id');
});

angular.module('junkstation').factory('Estado', function($resource){
    return $resource('/api/buscarUF/:id');
});

angular.module('junkstation').factory('buscarCategoriaAnuncio', function($resource){
    return $resource('/api/buscarCategoriaAnuncio/:id');
});

angular.module('junkstation').factory('Anuncio', function($resource){
    return $resource('/api/anuncio/:id');
});

angular.module('junkstation').factory('MeusAnuncios', function($resource){
    return $resource('/api/meusAnuncios/:id');
});

angular.module('junkstation').factory('ListaAnuncios', function($resource){
    return $resource('/api/listaAnuncios/:id');
});

angular.module('junkstation').factory('Marcas', function($resource){
    return $resource('/api/buscarMarcas/:id');
});

angular.module('junkstation').factory('Modelos', function($resource){
    return $resource('/api/buscarModelos/:id');
});



angular.module('junkstation').factory('Fotos', function($resource){
    return $resource('/api/enviarphoto');
});

