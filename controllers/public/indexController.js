module.exports = function(app) {
    var model          = app.models.admin.marca;
    var marca          = new model({});
    var controller     = {};
    var responseObject = {};

    controller.index = function(req, res, next) {
        var query = {situacao : true};
        marca.findByQuery(function(err, marcas){
            if(err){
                console.log(err);
                throw Exception("Ocorreu um erro durante o processamento da requisição ! :(");
            }else{
                responseObject.marcas = marcas;
                res.render('index' , {response : responseObject});
            }
        }, query);
    }
    
 
    return controller; 
};   
