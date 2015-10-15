var compressor  = require('node-minify');
module.exports = function(){
	/***********************************************************
	 * Faz a mimificação de todos os arquivos css do projeto   * 
	 ***********************************************************/
	new compressor.minify({
	    type: 'yui-css',
	    fileIn: [
	              'public/css/font-awesome.css',
	              'public/css/icomoon.css',
	              'public/css/font-awesome.css',
	              'public/css/jquery.fancybox-1.3.4.css',
	              'public/css/revslider.css',
	              'public/css/style.css',
	              'public/css/planos.css',
	              'public/css/responsive.css',
	              'public/css/ng-dialog.min.css'
	            ],
	    fileOut: 'public/dist/css/base-min.css',
	    callback: function(err, min){
	        //console.log(err);
	    }
	});

	new compressor.minify({
	    type: 'uglifyjs'                                              ,
	    fileIn: [
	              'public/js/lib/angular.min.js'                      ,
	              'public/js/lib/angular-resource.min.js'             ,
	              'public/js/lib/angular-route.min.js'                ,
	              'public/js/lib/angular-animate.js'                  ,
	              'public/js/lib/angular-messages.js'                 ,
	              'public/js/lib/angular-locale_pt-br.js'             ,
	              'public/js/lib/angular-dialog.min.js'               ,
	              'public/js/lib/angular-mask.js'               	  ,
	              'public/js/lib/jquery-1.9.1.min.js'                 ,
	              'public/js/lib/jquery-blockUI.js'      			  ,
	              'public/js/lib/superfish.js'                        ,
	              'public/js/lib/jquery.themepunch.plugins.min.js'    ,
	              'public/js/lib/jquery.themepunch.revolution.min.js' ,
	              'public/js/lib/form_style.js'                       ,
	              'public/js/lib/bootstrap.min.js'                    ,
	              'public/js/lib/jquery.placeholder.min.js'           ,
	              'public/js/lib/jquery.fancybox-1.3.4.js'            ,
	              'public/js/lib/jquery.gmap.min.js'                  ,
	              'public/js/lib/custom.js'							  ,
	              'public/js/lib/jquery-validator.js'				  ,
	              'public/js/lib/aditional-validator.js'			  ,
	              'public/js/app/util/util.js'						    
	            ],
	    fileOut: 'public/dist/js/core-min.js'                         ,
	    callback: function(err, min){
	      console.log(err);
	    }
	});

	new compressor.minify({
	    type: 'uglifyjs'                                                ,
	    fileIn: [
	              'public/js/app/app.js'                                        ,
	              'public/js/app/config/dialogConfig.js'						,
	              'public/js/app/service/admin/utilsService.js'          		,
	              'public/js/app/service/admin/anoFabricacaoService.js'         ,
	              'public/js/app/service/admin/cambioService.js'         		,
	              'public/js/app/service/admin/categoriaService.js'          	,
	              'public/js/app/service/admin/combustivelService.js'          	,
	              'public/js/app/service/admin/corService.js'          			,
	              'public/js/app/service/admin/estiloService.js'          		,
	              'public/js/app/service/admin/marcaService.js'          		,
	              'public/js/app/service/admin/modeloService.js'          		,
	              'public/js/app/service/admin/newsletterService.js'          	,
	              'public/js/app/service/admin/servicoService.js'          		,
	              'public/js/app/service/admin/ufService.js'          			,
	              'public/js/app/service/admin/planosService.js'          		,
	              'public/js/app/controllers/adminController.js'                ,
	              'public/js/app/controllers/admin/anoFabricacaoController.js'  ,
	              'public/js/app/controllers/admin/cambioController.js'  		,
	              'public/js/app/controllers/admin/categoriaController.js'      ,
	              'public/js/app/controllers/admin/combustivelController.js'    ,
	              'public/js/app/controllers/admin/corController.js'    		,
	              'public/js/app/controllers/admin/estiloController.js'    		,
	              'public/js/app/controllers/admin/marcaController.js'    		,
	              'public/js/app/controllers/admin/modeloController.js'    		,
	              'public/js/app/controllers/admin/newsletterController.js'    	,
	              'public/js/app/controllers/admin/servicoController.js'    	,
	              'public/js/app/controllers/admin/planosControllerr.js'    	,
	              'public/js/app/controllers/admin/ufController.js'    			,
	              'public/js/app/controllers/admin/ui/uiController.js'          ,
	              'public/js/app/interceptors/securityInterceptor.js'           ,
	              'public/js/app/routes/adminRoutes.js'  
	            ],
	    fileOut: 'public/dist/js/app-min.js'                          			,
	    callback: function(err, min){
	      console.log(err);
	    }
	});
}