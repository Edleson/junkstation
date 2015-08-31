
app.controller('uiAdminController', ['$scope', function ($scope) {
	$scope.showPanel = false;
	$scope.iconPanel = " - "

	$scope.panels = [
		{
			title : "Cadastro Geral", opened : false , contentPanel : false, links : [
				{href : "#", desc : "Gerenciar Marca"}			,
				{href : "#", desc : "Gerenciar Categoria"}		,
				{href : "#", desc : "Gerenciar Modelos"}		,
				{href : "#", desc : "Gerenciar Combustível"}	,
				{href : "#", desc : "Gerenciar Cor"}			,
				{href : "#", desc : "Gerenciar Câmbio"}			,
				{href : "#", desc : "Gerenciar Ano Fabricação"}	,
				{href : "#", desc : "Gerenciar Serviço"}		,
				{href : "#", desc : "Gerenciar Newletter"}		,
				{href : "#", desc : "Gerenciar Estilo"}			,
				{href : "#", desc : "Gerenciar Uf"}
			]  
		},
		{
			title : "Gerenciar Anúncios", opened : false , contentPanel : false, links : [
				{href : "#", desc : "Lista de Anunciantes"}		,
				{href : "#", desc : "Lista de Anúncios"}		
			]  
		},
		{
			title : "Relatórios", opened : false , contentPanel : false, links : [
				{href : "#", desc : "Relatório Anúncios"}		,
				{href : "#", desc : "Relatório Anunciantes"}	,
				{href : "#", desc : "Relatório Financeiro"}			
			]  
		}
	];

	$scope.togglePanel = function(panel){
		if(panel.opened){
			panel.opened 		= false;
			panel.contentPanel  = false;
		}else{
			panel.opened 		= true;
			panel.contentPanel  = true;
		}
	};
}]);