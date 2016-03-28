module.exports = function(app) {
    var Repository          = app.models.admin.anoFabricacao;
    var createResponseAPI   = app.models.admin.responseAPI; 
    var controller          = {};

    controller.findAll = function(req, res, next) {
        var ResponseAPI = createResponseAPI();
        Repository.find(function(error, entities){
            if(error){
                ResponseAPI.header.status  = 500 ;
                ResponseAPI.header.url     = req.url;
                ResponseAPI.header.message = "Não foi possível listar os anos!";
                ResponseAPI.header.error   = error;
                ResponseAPI.data           = [];
                res.status(500).json(ResponseAPI);
            }else{
                ResponseAPI.header.url     = req.url;
                ResponseAPI.data           = entities
                res.status(200).json(ResponseAPI);
            }
        }).sort({ano : -1});
    };

    controller.findById = function(req, res, next) {
        var id = req.params.id;
        var ResponseAPI = createResponseAPI();
        Repository.findById(id , function(error, entity){
            if(error){
                ResponseAPI.header.status  = 500 ;
                ResponseAPI.header.url     = req.url;
                ResponseAPI.header.message = "Não foi possível encontrar o ano " + id;
                ResponseAPI.header.error   = error;
                res.status(500).json(ResponseAPI);
            }else{
                ResponseAPI.header.url     = req.url;
                ResponseAPI.data           = entity
                res.status(200).json(ResponseAPI);
            }
        });
    };

    controller.create = function(req, res, next) {
        var entity = req.body;
        var ResponseAPI = createResponseAPI(); 
        Repository.create(entity, function(error, _entity){
            if(error){
                ResponseAPI.header.status  = 500 ;
                ResponseAPI.header.url     = req.url;
                ResponseAPI.header.message = "Ocorreu um erro durante a inclusão do ano";
                ResponseAPI.header.error   = error;
                res.status(500).json(ResponseAPI);
            }else{
                ResponseAPI.header.url     = req.url;
                ResponseAPI.data           = _entity
                res.status(201).json(ResponseAPI);
            }
        });
    };

    controller.update = function(req, res, next){
        var entity = req.body;
        var ResponseAPI = createResponseAPI(); 
        Repository.update({_id : entity._id}, entity, { multi: false }, function(error, _entity){
            if(error){
                ResponseAPI.header.status  = 500 ;
                ResponseAPI.header.url     = req.url;
                ResponseAPI.header.message = "Ocorreu um erro durante a atualização do ano";
                ResponseAPI.header.error   = error;
                res.status(500).json(ResponseAPI);
            }else{
                ResponseAPI.header.url     = req.url;
                ResponseAPI.data           = _entity
                res.status(200).json(ResponseAPI);
            }
        });
    };

    controller.destroy = function(req, res, next) {
        var id = req.params.id;
        var ResponseAPI = createResponseAPI(); 
        Repository.remove({"_id" : id}, function(error){
            if(error){
                ResponseAPI.header.status  = 500 ;
                ResponseAPI.header.url     = req.url;
                ResponseAPI.header.message = "Ocorreu um erro durante a remoção do ano";
                ResponseAPI.header.error   = error;
                res.status(500).json(ResponseAPI);
            }else{
                ResponseAPI.header.url     = req.url;
                ResponseAPI.data           = {};
                res.status(200).json(ResponseAPI);
            }
        });
    };
 
    return controller; 
};   
