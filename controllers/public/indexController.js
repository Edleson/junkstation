module.exports = function(app) {
    var htmlMinify        = app.get("html-minify");
    var categoria         = new app.models.admin.categoria({});
    var controller     = {};
    var responseObject = {}; 

    controller.index = function(req, res, next) {
        var query = {situacao : true};
        categoria.findByQuery(function(err, categorias){
            if(err){
                console.log(err);
                throw Exception("Ocorreu um erro durante o processamento da requisição ! :(");
            }else{
                responseObject.categorias = categorias;
                htmlMinify('index', res , {response : responseObject});
            }
        }, query);
    }

    return controller; 
};   
