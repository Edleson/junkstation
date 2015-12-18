module.exports = function(app) {
    var Plano             = new app.models.admin.plano({});
    var controller     = {};
    var responseObject = {};

    controller.index = function(req, res, next) {
        var query = {situacao : true, tipoPessoa : "PF"};
        Plano.findByQuery(function(err, planos){
            if(err){
                console.log(err);
                throw Exception("Ocorreu um erro durante o processamento da requisição ! :(");
            }else{
                responseObject.planos = planos;
                res.render("planos", {response : responseObject});
            }
        }, query);
    }

    return controller; 
};   
