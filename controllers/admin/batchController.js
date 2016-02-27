

module.exports = function(app) {

    var controller  = {};

    controller.start = function(req, res, next) {
        console.log("Iniciando o processamento das rotinas BATCH");
        assinaturasExpiradas();

    };

    function  assinaturasExpiradas(){
        var later = require('later');
        var schedule = later.parse.cron('0 30 16 ? * MON-FRI *', true);
        var action = later.setInterval(function(){
            console.log("Assinaturas Expiridas : " + new Date());
        }, schedule);
    }

    function testeSchedule(){
        var later = require('later');
        var cron2 = later.parse.cron('0/30 * * * * *', true);
        var time = later.setInterval(function(){
            console.log(new Date());
        }, cron2);
    }

    controller.start();

    return controller; 
};   
