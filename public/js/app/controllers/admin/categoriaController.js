
app.controller('categoriaController', ['$scope', function ($scope) {
	$scope.categorias = [];

	$scope.addCategoria = function(categoria){
		$scope.categorias.push(categoria);
		delete $scope.categoria;
	};

	$scope.editCategoria = function(index, categoria){
		console.log("edit Categoria" + Categoria);
	};
}]);