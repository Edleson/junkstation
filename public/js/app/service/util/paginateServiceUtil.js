app.factory("paginateServiceUtil", function () {
	
	/**
	 * [_paginate] Essa função é responsável em fazer a paginação de uma lista de entidades 
	 * recebida com parametos.
	 * @param  {[type]} entities     [Lista de entidade que será realizada a paginação]
	 * @param  {[type]} itensPerPage [Número de itens por página]
	 * @param  {[type]} length       [Tamanho da lista de entidades]
	 * @return {[type]}              [Retorn um objeto {pageNumber : '1', entities : []}]
	 */
	var _paginate = function(entities, itensPerPage, length){
		if(entities.length == 0){
			return [];
		}else{
			var page     = 1;
			var count    = 1;
			var paginate = [];
			var data     = [];
			var i        = 1;
			
			entities.forEach(function(item){
				data.push(item);
				if((count == itensPerPage) || (i == entities.length) ){
					paginate.push({pageNumber : page , entities : data});
					page++;
					count = 0;
					data = [];
				}
				i++;
				count++;
			});

			return paginate;
		}
	}

	/**
	 * [_getPage ] - Retorna uma lista de entidades para uma determinada página que foi 
	 * passada com argumento da função.
	 * 
	 * @param  {[type]} paginate   [Objeto paginete gerado na function _paginate.]
	 * @param  {[type]} pageNumber [O número da página que será retornado.]
	 * @return {[type]}            [Retorno a lista de entidade do objeto paginate de acordo com o número da página.]
	 */
	var _getPage = function(paginate, pageNumber){
		if(paginate){
			var map = paginate.filter(function(item){
				return item.pageNumber == pageNumber;
			});

			if(map.length > 0 ){
				return map[0].entities;
			}else{
				return [];
			}

		}else{
			return [];
		}
	}

	return {
		paginate   : _paginate ,
		getPage    : _getPage  
	};
});