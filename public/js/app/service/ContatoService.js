angular.module('junkstation').factory('Contato', function($resource){
    return $resource('/contatos/:id');
});

