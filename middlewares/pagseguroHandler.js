var toJSON    = require('xmljson').to_json;
var pagseguro = require('pagseguro');
var request   = require('request');

module.exports = function(context) {
    var pagseguroHandler  = {};

    pagseguroHandler.checkout = function(req , res, next, User, utils, Assinatura, planoAtual){
    	var id = req.user._id;
    	User.findById(id).deepPopulate("assinatura plano").exec(function(error, user ){
            if(error){
                next(error);
            }else{
            	req.user = user;
            	var emailComprador 	= user.local.email;
            	var ddd    			= user.dadosPessoais.celular.substring(1,3);
            	var numero 			= user.dadosPessoais.celular.substring(5);
            	var plano  			= user.plano;
            	var valorPlano 		= utils.numeral(plano.preco).format("0.00").replace("," , ".");
            	
            	/*********************************************************
			 	* Verifica se houve alteração de plano                   *
			 	**********************************************************/
            	if(planoAtual !== undefined && plano !== undefined){
            		var idPlanoAtual    = planoAtual._id.toString();
            		var idNovoPlano     = plano._id.toString();
            		if(idPlanoAtual === idNovoPlano){
            			console.log("Ataulização de Cadastros realizada sem alteração de plano !");
	            		res.redirect("/anuncio/create");
						return;	
            		}
            	}

            	/*********************************************************
			 	* Variáveis para serem utilizadas na assinatura          *
			 	* STATUS :                                               *
			 	* 	1 - Aguardando pagamento                             *
			 	*  	3 - Pago                                             *
			 	**********************************************************/
        		var inicioVigiencia = new Date();
        		var fimVigencia = utils.moment(inicioVigiencia).add(plano.expiracao, 'days');
        		var status      = valorPlano == "0.00" ? 3 : 1;
        		var operadora   = valorPlano == "0.00" ? "JUNKSTATION" : "PAGSEGURO";    
        		
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
					 	* Inicia o fluxo de pagamento                            *
					 	**********************************************************/
            			iniciarRequisicaoPagamento(req.user, plano, emailComprador, ddd, numero,valorPlano, res, Assinatura, next);
            		});
            	}else{
            		iniciarRequisicaoPagamento(req.user, plano, emailComprador, ddd, numero,valorPlano, res, Assinatura, next);
            	}
            }
        });
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

	/*********************************************************
 	* Inicia o fluxo de contração com pagseguro              *
 	**********************************************************/
	function iniciarRequisicaoPagamento(user, plano, emailComprador, ddd, numero, valorPlano, res, Assinatura, next){
		if(valorPlano == "0.00"){
			res.redirect("/anuncio/create");
			return;
		}

		/*********************************************************
	 	* Recupera as chaves de acesso ao pagseguro              *
	 	**********************************************************/
		var email = context.cobranca.pagseguro.email;
		var token = context.cobranca.pagseguro.token;

		/**********************************************************
	 	* Verifica se é ambiente de testes                        *
	 	**********************************************************/
	    if(context.cobranca.pagseguro.ambiente === "sandbox"){
	    	emailComprador = context.cobranca.pagseguro.comprador; 
	    }

	    /************************************************************
	 	* Monta o XML para obter o código de pagamento do pagseguro *
	 	*************************************************************/
		var xml = "";
		xml += 	' <?xml version="1.0" encoding="ISO-8859-1" standalone="yes"?>';
		xml += 	' <checkout>';
		xml += 		'<currency>BRL</currency>';
		xml += 		'<reference>'+ user.assinatura._id +'</reference>';					
		xml += 		'<redirectURL>'+ context.cobranca.pagseguro.getRedirectUrl() +'</redirectURL>';
		xml += 		'<notificationURL>'+ context.cobranca.pagseguro.getNotificationUrl() +'</notificationURL>';
		xml += 		'<items>';
		xml += 			'<item>';
		xml += 				'<id>0001</id>';
		xml += 				'<description>Assintura do plano '+ plano.titulo +'  na Junk Station</description>';
		xml += 				'<amount>'+ valorPlano +'</amount>';
		xml += 				'<quantity>1</quantity>';
		xml += 			'</item>';
		xml += 		'</items>';
		xml += 		'<sender>';
		xml += 			'<name>'+ user.dadosPessoais.nome +'</name>';
		xml += 			'<email>' + emailComprador +'</email>';
		xml += 			'<phone>';
		xml += 				'<areacode>' + ddd + '</areacode>';
		xml += 				'<number>'+ numero +'</number>';
		xml += 			'</phone>';
		xml += 		'</sender>';
		xml += 		'<shipping>';
		xml += 			'<type>1</type>';
		xml += 			'<address>';
		xml += 				'<street>'+ user.dadosPessoais.logradouro +'</street>';
		xml += 				'<number>'+ user.dadosPessoais.numeroLogradouro +'</number>';
		xml += 				'<complement>'+ user.dadosPessoais.complemento +'</complement>';
		xml += 				'<district>'+ user.dadosPessoais.bairro +'</district>';
		xml += 				'<postalcode>'+ user.dadosPessoais.cep +'</postalcode>';
		xml += 				'<city>'+ user.dadosPessoais.cidade +'</city>';
		xml += 				'<state>'+ user.dadosPessoais.estado +'</state>';
		xml += 				'<country>BRA</country>';
		xml += 			'</address>';
		xml += 		'</shipping>';
		xml += 	'</checkout>';

		/************************************************************
	 	* Monta as informações da request para o pagseguro          *
	 	*************************************************************/
		var options;
	    options = {
	    	uri : context.cobranca.pagseguro.getUrlPayment() , 
	        method: 'POST',
	        headers: {
	          'Content-Type': 'application/xml; charset=UTF-8'
	        },
	        body : xml
	    };

	    /************************************************************
	 	* Faz a chamada ao pagseguro e caso ocorra com sucesso      *
	 	*************************************************************/
	    request(options, function(err, response, body) {
	    	if (err) {
	        	console.log(err)
	        	next(err);
	        } else {
	           /*************************************************************
			 	* Faz o parse do XML no objeto JSON                         *
			 	*************************************************************/
	          	toJSON(body, function(error, result){
		        	if(error){
		        		next(error);
		        	}else{
		        		if(result.errors){
		        			console.log(result.errors);
		        			next(new Error("Ocorreu um erro durante o processamento do pagamento."));
		        		}else{
		        			var code = result.checkout.code;
		        			var checkoutUrl = context.cobranca.pagseguro.buildUrlCheckout(code);
		        			res.redirect(checkoutUrl);
		        		}
		        	}
				});
	        }
	    });
	}

    return pagseguroHandler;
};
