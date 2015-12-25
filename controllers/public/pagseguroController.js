var request  = require('request');
var toJSON   = require('xmljson').to_json;

module.exports = function(app) {
    var htmlMinify  = app.get("html-minify");
    var context     = app.get("context");
    var AnuncioDAO  = app.models.public.anuncio;
    var controller  = {};
    
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
                    console.log(result);
                });
            } 
        });
        htmlMinify('pagseguro_success', res , {});
    };

    controller.success = function(req, res, next) {
        htmlMinify('pagseguro_success', res , {});
    };

    return controller; 
};  