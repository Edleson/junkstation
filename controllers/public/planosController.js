module.exports = function(app) {
    var Plano          = new app.models.admin.plano({});
    var controller     = {};
    var responseObject = {};

    controller.index = function(req, res, next) {
        var query = {situacao : true};
        Plano.findByQuery(function(err, planos){
            if(err){
                console.log(err);
                throw Exception("Ocorreu um erro durante o processamento da requisição ! :(");
            }else{
                if(req.user && req.user.dadosPessoais.tipopessoa == "PJ"){
                    planos  = planos.filter(function(item){
                        return item.tipoPessoa == 'PJ';
                    });
                }else{
                    planos  = planos.filter(function(item){
                        return item.tipoPessoa == 'PF';
                    });
                }
                responseObject.planos = planos;
                res.render("planos", {response : responseObject});
            }
        }, query);
    }

    return controller; 
};   
