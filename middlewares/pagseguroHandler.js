module.exports = function(context) {
	var xml2Json         = require("xml2js");
  	var pagseguro        = require('pagseguro');
    var pagseguroHandler = {};

    pagseguroHandler.checkout = function(req , res, next, User, utils, Assinatura){
    	var id = req.user._id;
    	User.findById(id).deepPopulate("assinatura plano").exec(function(error, user ){
            if(error){
                next(error);
            }else{
            	var emailComprador 	= user.local.email;
            	var ddd    			= user.dadosPessoais.celular.substring(1,3);
            	var numero 			= user.dadosPessoais.celular.substring(5);
            	var plano  			= user.plano;
            	var valorPlano 		= utils.numeral(plano.preco).format("0.00").replace("," , ".");

            	//console.log(plano);
            	console.log(user.assinatura);

            	/*********************************************************
			 	* Variáveis para serem utilizadas na assinatura          *
			 	**********************************************************/
        		var inicioVigiencia = new Date();
        		var fimVigencia = utils.moment(inicioVigiencia).add(plano.expiracao, 'days');
        		var status      = valorPlano == "0.00" ? "APROVADO"     : "AGUARDANDO PAGAMENTO";
        		var operadora   = valorPlano == "0.00" ? "JUNKSTATION"  : "PAGSEGURO";    
        		
        		/*********************************************************
			 	* Configura os dados da assinatura                       *
			 	**********************************************************/
        		var assinatura  = {
        			user 				: id 				,
        			plano 				: plano._id 		,
        			nome_plano			: plano.titulo 		,
        			valor_pago  		: valorPlano 		,
        			operadora_cobranca  : operadora 		,
        			inicio_vigencia     : inicioVigiencia	,
        			fim_vigencia		: fimVigencia 		,
        			status              : status				
        		}

            	/*********************************************************
			 	* Caso o usuário não tenha assinatura entra no fluxo de  *
			 	* inclusão de nova assinatura.                           *
			 	**********************************************************/
            	if(user.assinatura === undefined){
            		/*********************************************************
				 	* Grava a assinatura na base de dados                    *
				 	**********************************************************/
            		var newAssinatura = new Assinatura(assinatura);
            		newAssinatura.save(function(err2, newAss){
            			if(err2){
            				console.log(err2)
            			}

            			/*********************************************************
					 	* Grava a assinatura na base de dados                    *
					 	**********************************************************/
            			var upd = {assinatura : newAss._id };
            			User.update({_id : user._id}, upd, function(err3, userUpd){
            				if(err3){
            					console.log("Erro ao atualiza a assinatura do usuário pagseguroHandler.js");
            					console.log(err3);
            					next(err3);
            				}
            			});
            			/*********************************************************
					 	* Atualiza os dados de assinatura do usuário logado      *
					 	**********************************************************/
            			req.user.assinatura = newAss;
            			/*********************************************************
					 	* Inicia o fluxo de pagamento      *
					 	**********************************************************/
            			iniciaFluxoPagamento(req.user, plano, emailComprador, ddd, valorPlano, res);
            		});
            	}else{
            		res.redirect("/anuncio/create");
            	}
            }
        });
	};

	pagseguroHandler.atualizaStatus = function(req, res, next){

	};

	/*******************************************************
     * Valida se a assinatura do plano está ativa 		   *
     *******************************************************/
	function isVigenciaAtiva(assinatura, utils){
		var fimVigencia = utils.moment(assinatura.fim_vigencia);
		var now = utils.moment();
		if(now <= fimVigencia){
			return true;
		}else{
			return false;
		}
	}

	function iniciaFluxoPagamento(user, plano, emailComprador, ddd, valorPlano, res  ){
		if(user.assinatura.status === "COMPLETO" || user.assinatura.status === "APROVADO"){
    		res.redirect("/anuncio/create");
    	}else{
        	/**********************************************************
		 	* Verifica se é ambiente de testes                        *
		 	**********************************************************/
	    	pag = new pagseguro({
		        email : context.cobranca.pagseguro.email ,
		        token : context.cobranca.pagseguro.token 
		        //mode  : 'sandbox'
		    });
	    	
	    	/**********************************************************
		 	* Verifica se é ambiente de testes                        *
		 	**********************************************************/
		    if(context.cobranca.pagseguro.ambiente === "sandbox"){
		    	pag.mode       = "sandbox";
		    	emailComprador = context.cobranca.pagseguro.comprador; 
		    }
		    
		    /*********************************************************
		 	* Seta a sigla da moeda corrente                         *
		 	**********************************************************/
		    pag.currency('BRL');
		    
		    /*********************************************************
		 	* Seta o código de referencia da compra                  *
		 	**********************************************************/
		    pag.reference(plano._id);
		    
		    /*********************************************************
		 	* Add o item que será utilizado para compra              *
		 	**********************************************************/
		    pag.addItem({
		        id 			: 1,
		        description : "Assintura do plano " + plano.titulo + " na Junk Station",
		        amount 		: valorPlano ,
		        quantity 	: 1
		    });
		    
		    /*********************************************************
		 	* Configura as informações do comprador                  *
		 	**********************************************************/
		    pag.buyer({
		        name          : user.dadosPessoais.nome	,
		        email         : emailComprador			,
		        phoneAreaCode : ddd 					,
		        phoneNumber   : numero
		    });
		    
		    /*********************************************************
		 	* Configurando as informações de entrega                 *
		 	**********************************************************/
		    pag.shipping({
		        type 		: 1										,
		        street 		: user.dadosPessoais.logradouro			,
		        number 		: user.dadosPessoais.numeroLogradouro 	,
		        complement 	: user.dadosPessoais.complemento		,
		        district 	: user.dadosPessoais.bairro				,
		        postalCode 	: user.dadosPessoais.cep				,
		        city 		: user.dadosPessoais.cidade				,
		        state 		: user.dadosPessoais.estado				,
		        country 	: 'BRA'
		    });
		    
		    /*********************************************************
		 	* Seta as urls de notificação e redirecionamento         *
		 	**********************************************************/
		 	pag.setRedirectURL(context.cobranca.pagseguro.getRedirectUrl());
		    pag.setNotificationURL(context.cobranca.pagseguro.getNotificationUrl());
		    
		    /*********************************************************
		 	* Envia a solicitação para o pagseguro                   *
		 	**********************************************************/
		   	pag.send(function(err, response) {
		   		console.log(response);
		        if (err) {
		            next(err);
		        }else{
		        	xml2Json.parseString(response, function(error, result){
			        	if(error){
			        		next(error);
			        	}else{
			        		if(result.errors){

			        		}else{
			        			var checkoutUrl = context.cobranca.pagseguro.buildUrlCheckout(result.checkout.code[0]);
			        			res.redirect(checkoutUrl);
			        		}
			        	}
					});
		        } 
		    });	
    	}	
	}
    		
    return pagseguroHandler;
};
