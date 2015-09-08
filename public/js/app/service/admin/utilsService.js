app.factory("utilsService", function () {
	
	var _listarSituacao = function(){
		return new Array(
			{nome : "Ativo"   , valor : true  },
			{nome : "Inativo" , valor : false }
		);
	};

	return {
		listarSituacao    : _listarSituacao 	
	};
});