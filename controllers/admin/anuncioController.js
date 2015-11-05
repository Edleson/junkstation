module.exports = function(app) {
    var Repository          = app.models.public.anuncio;
    var UserRepository      = app.models.admin.user;
    var createResponseAPI   = app.models.admin.responseAPI;  
    var controller          = {};

    controller.listaAnuncios = function(req, res, next) {
        var ResponseAPI = createResponseAPI();
        Repository.find(function(error, entities){
            if(error){
                ResponseAPI.header.status  = 500 ;
                ResponseAPI.header.url     = req.url;
                ResponseAPI.header.message = "Não foi possível listar os anúncios!";
                ResponseAPI.header.error   = error;
                ResponseAPI.data           = [];
                res.status(500).json(ResponseAPI);
            }else{
                ResponseAPI.header.url     = req.url;
                ResponseAPI.data           = entities;
                res.status(200).json(ResponseAPI);
            }
        });
    };

    controller.listaAnunciantes = function(req, res, next) {
        var ResponseAPI = createResponseAPI();
        Repository.distinct("user", function(error, ids){
            console.log(ids);
            UserRepository.find({"_id" : {$in : ids}}).exec(function(error, entities){
                if(error){
                    ResponseAPI.header.status  = 500 ;
                    ResponseAPI.header.url     = req.url;
                    ResponseAPI.header.message = "Não foi possível listar os anunciantes !";
                    ResponseAPI.header.error   = error;
                    ResponseAPI.data           = [];
                    res.status(500).json(ResponseAPI);
                }else{
                    ResponseAPI.header.url     = req.url;
                    ResponseAPI.data           = entities;
                    res.status(200).json(ResponseAPI);
                }
            });
        });
    };

    return controller; 
};   
