
app.controller('uiAdminController', ['$scope', function ($scope) {
	/******************************************************************************
	 *  Essa array tem todos os panels do menu lateral da pagina de administração *
	 * para inclusão de um novo panel será necessário a inclusão do dados do panel*
	 * nesse array.                                                               *
	 ******************************************************************************/
	$scope.panels = [
		{
			title : "Cadastro Geral", opened : false , contentPanel : false, links : [
				{href : "#/marca"	  	 , desc : "Gerenciar Marca"			},
				{href : "#/categoria"	 , desc : "Gerenciar Categoria"		},
				{href : "#/modelo"	 	 , desc : "Gerenciar Modelo"		},
				{href : "#/combustivel"	 , desc : "Gerenciar Combustível"	},
				{href : "#/cor"			 , desc : "Gerenciar Cor"			},
				{href : "#/cambio"		 , desc : "Gerenciar Cambio"		},
				{href : "#/anoFabricacao", desc : "Gerenciar Ano Fabricação"},
				{href : "#/servico" 	 , desc : "Gerenciar Serviço"		},
				{href : "#/newsletter" 	 , desc : "Gerenciar Newsletter"	},
				{href : "#/estilo"       , desc : "Gerenciar Estilo"		},
				{href : "#/uf"           , desc : "Gerenciar Uf"			}
			]  
		},
		{
			title : "Gerenciar Anúncios", opened : false , contentPanel : false, links : [
				{href : "#"				 , desc : "Lista de Anunciantes"	},
				{href : "#"				 , desc : "Lista de Anúncios"		}		
			]  
		},
		{
			title : "Relatórios", opened : false , contentPanel : false, links : [
				{href : "#"				 , desc : "Relatório Anúncios"		},
				{href : "#"              , desc : "Relatório Anunciantes"	},
				{href : "#"              , desc : "Relatório Financeiro"	}			
			]  
		}
	];

	/****************************************************************************
	 *  Essa funcão é responsável pelo controle do widget do menu lateral, onde *
	 * ao clicar no icone de + ou - ele oculta ou aprensenta as funcionalidades * 
	 * referentes ao panel.                                                     *
	 ****************************************************************************/
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