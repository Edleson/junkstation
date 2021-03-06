var request  = require('request');
var toJSON   = require('xmljson').to_json;

module.exports = function(app) {
    var htmlMinify    = app.get("html-minify");
    var context       = app.get("context");
    var Anuncio       = app.models.public.anuncio;
    var PagseguroUtil = app.util.pagseguroUtil;
    var Assinatura    = app.models.admin.assinatura;
    var emailSender   = app.get("emailSender");
    var controller    = {};
    
    /***********************************************************
     * Recebe as notificações de mudança de staus do pagseguro *
     *a url de notificação (/pagseguro/notificacao).           * 
     ***********************************************************/
    controller.index = function(req, res, next) {
        /**********************************************************
         * Recupera as informações enviadas ao pagseguro          *
         **********************************************************/
        var notification = req.body;
        /**********************************************************
         * Cria a url para recuperar os dados da transação        *
         **********************************************************/
        var urlPesquisa  = context.cobranca.pagseguro.getUrlSearchTransaction(notification.notificationCode);
        /**********************************************************
         * Envia um request para o pagseguro para recuperar       *
         *as informações da da transação                          *
         **********************************************************/
        request(urlPesquisa, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                /**********************************************************
                 * Faz o parse do XML retornado pelo pagseguro            *
                 **********************************************************/
                toJSON(body, function(error, result){
                    console.log("Notificação do Pagseguro Recebida ......")
                    var transactionID = result.transaction.code;
                    var reference     = result.transaction.reference;
                    var status        = parseInt(result.transaction.status);
                    /**********************************************************
                     * Recupera as informações da assinatura do cliente       *
                     **********************************************************/
                    Assinatura.findById(reference).deepPopulate('plano').exec(function(error, assinatura){
                        var nomeStatus = PagseguroUtil.getStatus(status)[0].nome;
                        if(assinatura){
                            /**********************************************************
                             * Atualiza os dados da assinatura                        *
                             **********************************************************/
                            var evento = {
                                descricaoEvento : "Notificação de cobrança recebida, o status da sua assinatura foi alterado para " + nomeStatus ,
                                dataEvento      : new Date(),
                                tipoEvento      : "ALTERAÇÃO STATUS"
                            };
                            assinatura.id_transacao = transactionID;
                            assinatura.status = status;
                            assinatura.historico.push(evento);
                            assinatura.vencido = false;
                            /**********************************************************
                             * Atualiza os dados da assinatura na base de dados       *
                             **********************************************************/
                            Assinatura.update({_id : assinatura._id}, assinatura , function(error, isOK){
                                if(error){
                                    console.log("Aconteceu um erro durante a atualização da Assinatura. -> pagseguroController.index()")
                                }else{
                                    console.log("Assinatura atualizada com sucesso. -> pagseguroController.index()");
                                    console.log(isOK);
                                    /**********************************************************
                                     * Se o status do pagamento for igual pago atualiza os    * 
                                     * anúncios e libera para o mecanismo de busca            *
                                     * STATUS :                                               *
                                     *   3 - Pago                                             *
                                     **********************************************************/
                                    var userID      = assinatura.user;
                                    var planoId     = assinatura.plano._id;
                                    var relevancia  = assinatura.plano.relevancia;
                                    var fimVigencia = assinatura.fim_vigencia; 
                                    if(status === 3){
                                        var anuncioUPD = {
                                            plano           : planoId       ,
                                            relevancia      : relevancia    ,
                                            status          : true          ,
                                            data_vencimento : fimVigencia   ,
                                            assinatura      : reference     
                                        }

                                        /*********************************************************
                                        * Atualiza os dados dos anúncios de acordo com o plano   *
                                        * escolhido.                                             *
                                        **********************************************************/
                                        Anuncio.update({assinatura : reference}, anuncioUPD, {multi : true}, function(error, isOK){
                                            if(error){
                                                console.log("Ocorreu um erro durante a atualização dos dos dos anúncios. -> pagseguroController.index()");
                                            }else{
                                                console.log("Dados dos anuncios atualizado com sucesso -> pagseguroController.index()");
                                                console.log(isOK);
                                            }
                                        });

                                    /**********************************************************
                                     * Se o status do pagmento for diferente de pago invalidar*
                                     * os anúncios.                                           *                          
                                     * STATUS :                                               *
                                     *   5 - Em disputa                                       *
                                     *   6 - Devolvida                                        *
                                     *   7 - Cancelada                                        *
                                     *   8 - Devolvido ao comprador                           *
                                     *   9 - Em contestação                                   *   
                                     **********************************************************/     
                                    }else if(status === 5 || status === 6 || status === 7 || status === 8 || status === 9 ){
                                        var anuncioInvalido = {
                                            status          : false         ,
                                            data_vencimento : new Date()
                                        }

                                        /*********************************************************
                                        * Caso o pagamento não seja efetuado inválida os anuncios*
                                        **********************************************************/
                                        Anuncio.update({assinatura : reference}, anuncioInvalido, {multi : true}, function(error, isOK){
                                            if(error){
                                                console.log("Ocorreu um erro durante a atualização dos dos dos anúncios. -> pagseguroController.index()");
                                            }else{
                                                console.log("Dados dos anuncios atualizado com sucesso -> pagseguroController.index()");
                                                console.log(isOK);
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    });
                });
            } 
        });

        htmlMinify('pagseguro_response', res , {});
    };

    controller.success = function(req, res, next) {
        htmlMinify('pagseguro_success', res , {});
    };

    return controller; 
};  