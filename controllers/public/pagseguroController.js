
module.exports = function(app) {
    var htmlMinify  = app.get("html-minify");
    var pagseguro   = app.get("pagseguro");
    var request     = require('request');
    var controller     = {};
    // var responseObject = {}; 

    controller.index = function(req, res, next) {
        var notification = req.body;
        var urlPesquisa  = pagseguro.getUrlSearchTransaction(notification.notifcationCode);
        console.log(urlPesquisa);
        request('http://www.google.com', function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body);
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