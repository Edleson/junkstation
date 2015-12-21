var request  = require('request');
//var xml2Json = require("xml2js");
var toJSON = require('xmljson').to_json;

module.exports = function(app) {
    var htmlMinify  = app.get("html-minify");
    var context     = app.get("context");
    var controller  = {};
    // var responseObject = {}; 

    controller.index = function(req, res, next) {
        var notification = req.body;
        console.log(notification);
        var urlPesquisa  = context.cobranca.pagseguro.getUrlSearchTransaction(notification.notificationCode);
        console.log(urlPesquisa);
        request(urlPesquisa, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                //console.log(body);
                toJSON(body, function(error, result){
                    console.log(result);
                });
            } 
        });

        htmlMinify('pagseguro_success', res , {});
    }

    controller.success = function(req, res, next) {
        console.log(req.body);
        htmlMinify('pagseguro_success', res , {});
    }

    return controller; 
};  