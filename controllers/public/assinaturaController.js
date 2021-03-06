var path = require('path');
var fs   = require('fs');
var del  = require("del");

module.exports = function(app) {
    var htmlMinify       = app.get("html-minify");
    var Assinatura       = app.models.admin.assinatura;
    var User             = app.models.admin.user;
    var Anuncio          = app.models.public.anuncio;
    var plano            = new app.models.admin.plano({});
    var DAPlano          = app.models.admin.plano  
    var pagseguroUtil    = app.util.pagseguroUtil;
    var context          = app.get("context");
    var utils            = app.util.utils;
    var pagseguroHandler = require("./../../middlewares/pagseguroHandler")(context); 
    var controller   = {}; 

    controller.listarAssinaturaByUser = function(req, res, next) {
        findAssinaturaByUser(req, res, next);
    };
 
    controller.findAssinaturaById     = function(req, res, next) {
        var id = req.params.id;

        Assinatura.findById(id).deepPopulate('plano').exec(function(error, assinatura){
            if(error){
                next(error);
            }else{
                params = {
                    assinatura    : assinatura      ,
                    pagseguroUtil : pagseguroUtil   
                };
                htmlMinify('partials/assinatura_detalhe', res , {params : params});
            }
        });       
    };

    controller.cancelarAssinatura     = function(req, res, next) {
        var id     = req.params.id;
        var userId = req.user._id; 
        Assinatura.findById(id).deepPopulate('plano').exec(function(error, assinatura){
            if(error){
                next(error);
            }else{
                /*****************************************************************
                 * Atualiza o status para cancelado pelo cliente.                *
                 *****************************************************************/
                assinatura.status       = 21;    // 21 - Cancelado pelo Cliente
                assinatura.vencido      = false; // muda a flag de expirado.
                assinatura.fim_vigencia = new Date();
                assinatura.historico.push({
                    tipoEvento       : "CANCELAMENTO ASSINATURA"    ,
                    descricaoEvento  : "Assinatura cancelada pelo cliente."
                });

                /*****************************************************************
                 * Atualiza o status da assinatura na base de dados              *
                 *****************************************************************/
                Assinatura.update({_id : id}, assinatura, function(error, isOK){
                    if(error){
                        console.log("Ocorreu um erro durante o cancelamento da assinatura. -> AssinaturaController.cancelarAssinatura()");
                        console.log(error);
                    }
                    console.log("Assinatura cancelada com sucesso!. -> AssinaturaController.cancelarAssinatura() ");
                    console.log(isOK); 
                });
                
                /*****************************************************************
                 * Atualiza os anúncios do usuário para que não aparecam mais na *
                 *nos mecanismos de busca                                        *
                 *****************************************************************/
                excluiAnuncioByAssinatura(req, assinatura);
                /*****************************************************************
                 * Atualiza os dados do usuário                                  *
                 *****************************************************************/
                req.user.plano      = null;
                req.user.assinatura = null;
                User.update({_id : req.user._id}, req.user, function(error, isOK){
                    if(error){
                        console.log("Ocorreu um erro durante a atualização do usuário -> AssinaturaController.cancelarAssinatura()");
                        console.log(error);  
                    }
                    console.log("Usuário atualizado com sucesso! -> AssinaturaController.cancelarAssinatura()");
                    console.log(isOK); 
                 });

                 //res.redirect("/assinatura/listar");
                 findAssinaturaByUser(req, res, next, true);
            }
        });
    };

    controller.renovarAssinatura      = function(req, res, next) {
        var assinaturaID = req.params.id;
        Assinatura.findById(assinaturaID).deepPopulate('plano user').exec(function(error, assinatura){
            if(error){
                console.log(error);
                next(error);
            }else{
                var plano       = assinatura.plano;
                var user        = assinatura.user;
                var valorPlano  = utils.numeral(plano.preco).format("0.00").replace("," , ".");
                /*********************************************************
                * Inicia o fluxo de pagamento                            *
                **********************************************************/
                var emailComprador  = req.user.local.email;
                var ddd             = req.user.dadosPessoais.celular.substring(1,3);
                var numero          = req.user.dadosPessoais.celular.substring(5);
                /*********************************************************
                * Variáveis para serem utilizadas na assinatura          *
                * STATUS :                                               *
                *   1 - Aguardando pagamento                             *
                *   3 - Pago                                             *
                **********************************************************/
                var inicioVigiencia = new Date();
                var fimVigencia = utils.moment(inicioVigiencia).add(plano.expiracao, 'days');
                var status      = valorPlano == "0.00" ? 3 : 1;
                var operadora   = valorPlano == "0.00" ? "JUNKSTATION" : "PAGSEGURO";
                /*********************************************************
                * Configura os dados da assinatura                       *
                **********************************************************/
                assinatura.inicio_vigencia = inicioVigiencia;
                assinatura.fim_vigencia    = fimVigencia;
                assinatura.status          = status;
                assinatura.vencido         = true;
                /*********************************************************
                * Inclui um novo dados de histórico na assinatura        *
                **********************************************************/
                if(status == 3){
                    assinatura.vencido = false;
                    assinatura.historico.push({
                        descricaoEvento : "Assinatura renovado com sucesso" ,
                        tipoEvento      : "RENOVAÇÃO ASSINATURA"
                    });
                    /*********************************************************
                    * Atualiza os anuncios                                   *
                    **********************************************************/
                    var anuncioUPD = {
                        status          : true          ,
                        data_vencimento : fimVigencia       
                    }
                    Anuncio.update({assinatura : assinatura._id}, anuncioUPD, function(error, isOK){
                        if(error){
                            console.log(error);    
                        }
                        
                    })

                }else{
                    assinatura.historico.push({
                        descricaoEvento : "Aguardando o pagamento da renovação da assinatura." ,
                        tipoEvento      : "Renovação Assinatura"
                    });
                }
                /*********************************************************
                * Atualiza os dados da assinatura na base de dados       *
                **********************************************************/
                Assinatura.update({_id : assinatura._id}, assinatura , function(error, isOK){
                    if(error){
                        console.log("Ocorreu um erro durante a atualização da assinatura. -> assinaturaController.iniciarRequisicaoPagamento()");
                        next(error)
                    }
                });
                /*********************************************************
                * Atualiza os dados da assinatura no usuario logado      *
                **********************************************************/
                req.user.assinatura = assinatura;

                if(valorPlano == "0.00"){
                    res.redirect("/anuncio/meusanuncios");
                    return;
                }
                /*********************************************************
                * Inicia o fluxo de pagamento com o pagseguro            *
                **********************************************************/
                pagseguroHandler.checkoutPagseguro(req , res, next, req.user, plano, emailComprador, ddd, numero, valorPlano, Assinatura);
            }
        })


        var assinatura = req.user.assinatura;
        var userID     = req.user._id;
        /*****************************************************************
         * Atualiza os anuncios com a nova data de vencimento            *
         *****************************************************************/
        Anuncio.update({user : userID}, {data_vencimento : assinatura.fim_vigencia}, {multi : true}, function(error, isOK){
            if(error){
                console.log("Ocorreu um erro durante a atulização dos anuncios durante a renovação da assinatura!assinaturaController.renovarAssinatura()");
            }
            console.log("Anuncios atualizados com sucesso ! assinaturaController.renovarAssinatura()");
            console.log(isOK);
        });

    };

    controller.criarAssinatura        = function(req, res, next) {
        var entity   = req.body;
        var plano_id = entity.plano;
        var user     = req.user;

        /*****************************************************************
         * Recupera os dados do Plano                                    *
         *****************************************************************/
         DAPlano.findById(plano_id , function(error, plano){
            if(error){
                next(error)
            }else{
                /*****************************************************************
                 * Recupera os dados do Plano                                    *
                 *****************************************************************/
                var planosGratis = user.assinaturas.filter(function(item){
                    return (item.valor_pago == 0 && (item.status == 3 || item.status == 4)); 
                });

                if(planosGratis.length == 1 && plano.preco == 0){
                    req.flash('assinatura', '<div class="alert-error">Você não pode ter mais de um plano grátis ativo :(</div>');
                    findAssinaturaByUser(req, res, next, true);
                    return;
                }
                /*****************************************************************
                 * Cria os dados da Assinatura                                    *
                 *****************************************************************/
                var valorPlano   = utils.numeral(plano.preco).format("0.00").replace("," , ".");
                /*********************************************************
                * Variáveis para serem utilizadas na assinatura          *
                * STATUS :                                               *
                *   1 - Aguardando pagamento                             *
                *   3 - Pago                                             *
                **********************************************************/
                var inicioVigiencia = new Date();
                var fimVigencia = utils.moment(inicioVigiencia).add(plano.expiracao, 'days');
                var status      = valorPlano == "0.00" ? 3 : 1;
                var operadora   = valorPlano == "0.00" ? "JUNKSTATION" : "PAGSEGURO";    
                /*********************************************************
                * Configura os dados da assinatura                       *
                **********************************************************/
                var assinatura  = {
                    user                : user._id               ,
                    nome_assinatura     : entity.nome_assinatura ,
                    plano               : plano._id              ,
                    nome_plano          : plano.titulo           ,
                    valor_pago          : valorPlano             ,
                    operadora_cobranca  : operadora              ,
                    inicio_vigencia     : inicioVigiencia        ,
                    fim_vigencia        : fimVigencia            ,
                    status              : status                 ,
                    url_pagamento       : "/anuncio/meusdados"   ,
                    historico           : [{
                        descricaoEvento : "Cadastro de assinutra recebido com sucesso. Aguardando Pagamento" ,
                        tipoEvento      : "ASSINATURA"
                    }]              
                }
                /*********************************************************
                * Grava a assinatura na base de dados                    *
                **********************************************************/
                var newAssinatura = new Assinatura(assinatura);
                newAssinatura.save(function(err2, newAss){
                    if(err2){
                        console.log(err2)
                    }
                    
                    /*********************************************************
                    * Atualiza os dados de assinatura do usuário logado      *
                    **********************************************************/
                    newAss.plano = plano;
                    req.user.assinatura = newAss;
                    req.user.assinaturas.push(newAss);
                    /*********************************************************
                    * Grava a assinatura na base de dados                    *
                    **********************************************************/
                    //var upd = {assinatura : newAss._id };
                    req.user.plano = plano;
                    User.update({_id : user._id}, req.user, function(err3, userUpd){
                        if(err3){
                            console.log("Erro ao atualiza a assinatura do usuário pagseguroHandler.js");
                            console.log(err3);
                            next(err3);
                        }
                    });
                    /*********************************************************
                    * Inicia o fluxo de pagamento                            *
                    **********************************************************/
                    var emailComprador  = user.local.email;
                    var ddd             = user.dadosPessoais.celular.substring(1,3);
                    var numero          = user.dadosPessoais.celular.substring(5);
                    pagseguroHandler.checkoutPagseguro(req , res, next, req.user, plano, emailComprador, ddd, numero, valorPlano, Assinatura);
                });
               // console.log(assinatura);
            }
        });
        //res.redirect('/assinatura/listar');
    };
    
    /**
     * [criarAssinaturaOneClick] Esse função é responsável em criar uma 
     * assinatura sem precisar de muitas iterações do usuário, esse fluxo
     * se inicia na páginas de planos quando o usuário escolhe um plano e 
     * clica no botão assinar.
     * 
     * @param  {[Request]}  req  [Objeto do midleware Express.js]
     * @param  {[Response]} res  [Objeto do midleware Express.js]
     * @param  {Function}   next [Function do midleware Express.js]
     */
    controller.criarAssinaturaOneClick  = function(req, res, next){
       /******************************************************************
        * Essa função será divida em alguns passos :                     *
        * 01 - Verificar se o usuário está logado.                       *
        ******************************************************************/
        var planoID = req.params.planoID;
        if(!req.user){
            res.redirect('https://' + req.headers.host + "/login?planoID="+ planoID);
            return;
        }
        /******************************************************************
        * 02 - Verifica se o usuário tem todas as informações necessárias *
        * para realizar a contração do plano escolhido.                   *
        *******************************************************************/
        if(!req.user.dadosPessoais.tipopessoa){
            res.redirect('https://' + req.headers.host + "/anuncio/meusdados?planoID="+ planoID);
            return;
        }
        /******************************************************************
        * 03 - Cria a assinatura e começa o fluxo de pagamento.           *
        *******************************************************************/
        DAPlano.findById(planoID , function(error, plano){
            if(error){
                console.log(error)
                next(error)
            }else{
                /*********************************************************
                 * Cria os dados da Assinatura                           *
                 *********************************************************/
                var valorPlano   = utils.numeral(plano.preco).format("0.00").replace("," , ".");
                /*********************************************************
                * Variáveis para serem utilizadas na assinatura          *
                * STATUS :                                               *
                *   1 - Aguardando pagamento                             *
                *   3 - Pago                                             *
                **********************************************************/
                var inicioVigiencia = new Date();
                var fimVigencia = utils.moment(inicioVigiencia).add(plano.expiracao, 'days');
                var status      = valorPlano == "0.00" ? 3 : 1;
                var operadora   = valorPlano == "0.00" ? "JUNKSTATION" : "PAGSEGURO";    
                /*********************************************************
                * Configura os dados da assinatura                       *
                **********************************************************/
                var assinatura  = {
                    user                : req.user._id               ,
                    nome_assinatura     : plano.titulo           ,
                    plano               : plano._id              ,
                    nome_plano          : plano.titulo           ,
                    valor_pago          : valorPlano             ,
                    operadora_cobranca  : operadora              ,
                    inicio_vigencia     : inicioVigiencia        ,
                    fim_vigencia        : fimVigencia            ,
                    status              : status                 ,
                    url_pagamento       : "/anuncio/meusdados"   ,
                    historico           : [{
                        descricaoEvento : "Cadastro de assinutra recebido com sucesso. Aguardando Pagamento" ,
                        tipoEvento      : "ASSINATURA"
                    }]              
                }
                /*********************************************************
                * Grava a assinatura na base de dados                    *
                **********************************************************/
                var newAssinatura = new Assinatura(assinatura);
                newAssinatura.save(function(err2, newAss){
                    if(err2){
                        console.log(err2)
                    }
                    /*********************************************************
                    * Atualiza os dados de assinatura do usuário logado      *
                    **********************************************************/
                    newAss.plano = plano;
                    req.user.assinatura = newAss;
                    req.user.assinaturas.push(newAss);
                    /*********************************************************
                    * Grava a assinatura na base de dados                    *
                    **********************************************************/
                    req.user.plano = plano;
                    User.update({_id : req.user._id}, req.user, function(err3, userUpd){
                        if(err3){
                            console.log("Erro ao atualiza a assinatura do usuário pagseguroHandler.js");
                            console.log(err3);
                            next(err3);
                        }
                    });
                    /*********************************************************
                    * Inicia o fluxo de pagamento                            *
                    **********************************************************/
                    var emailComprador  = req.user.local.email;
                    var ddd             = req.user.dadosPessoais.celular.substring(1,3);
                    var numero          = req.user.dadosPessoais.celular.substring(5);
                    pagseguroHandler.checkoutPagseguro(req , res, next, req.user, plano, emailComprador, ddd, numero, valorPlano, Assinatura);
                });
            }
        });
    }

    function findAssinaturaByUser(req, res, next, updateUser){
        var user    = req.user;
        var query  = {situacao : true};
        Assinatura.find({user : user._id}).deepPopulate('plano').sort({inicio_vigencia : -1}).exec(function(error, assinaturas){
            if(error){
                next(error);
            }else{

                params = {
                    assinaturas   : assinaturas     ,
                    pagseguroUtil : pagseguroUtil   ,
                    planos        :  []
                };

                plano.findByQuery(function(error, planos ){
                    params.planos = planos;
                    htmlMinify('assinatura_listar', res , {params : params});
                }, query);
                
            }

            if(updateUser){
                req.user.assinaturas = assinaturas;
                User.update({_id : req.user._id}, req.user, function(err3, userUpd){
                    if(err3){
                        console.log(err3);
                        next(err3);
                    }
                });
            }
        });
    }

    function excluiAnuncioByAssinatura(req, assinatura){
        Anuncio.find({assinatura : assinatura._id}).exec(function(error, anuncios){
            if(error){
                console.log("Ocorreu um erro durante a exclusão dos anuncios da assinatura : " + assinatura._id);
                next(error);
            }else{
                /*****************************************************************
                 * Apaga todos os diretórios com as imagens dos anúncios         *
                 *****************************************************************/
                anuncios.forEach(function(item) {
                    //console.log(item._id);
                    var anuncioDir   = '../../public/tmp/anuncio/';
                    del(path.join(__dirname, anuncioDir + item._id)).then(function(paths){
                       // console.log('Anuncio '+ item._id +' deletadao com sucesso  : \n', paths.join('\n'));
                    });
                });

                /*****************************************************************
                 * Apaga todos os anúncios dessa assinatura                      *
                 *****************************************************************/
                Anuncio.remove({assinatura : assinatura._id}, function(error){
                    if(error){
                        console.log("Ocorreu um erro durante a exclusão dos anuncios da assinatura : " + assinatura._id);
                        next(error);
                    }else{
                        assinatura.qtdAnuncio = 0;
                        Assinatura.update({_id : assinatura._id} , assinatura,  function(error, isOK){
                            if(error){
                                next(error)
                            }
                            console.log(isOK)
                        });
                    }
                });
            }
        });
    }

    return controller; 
}; 