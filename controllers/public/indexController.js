module.exports = function(app) {
    var marca             = new app.models.admin.marca({});
    var modelo            = new app.models.admin.modelo({});
    var uf                = new app.models.admin.uf({});
    var createResponseAPI = app.models.admin.responseAPI;
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

    controller.findModeloByMarca = function(req, res, next) {
        var marcaId     = req.params.id;  
        var query       = {situacao : true , marca : marcaId};
        var ResponseAPI = createResponseAPI();
        modelo.findByQuery(function(err, modelos){
            if(err){
                ResponseAPI.header.status  = 500 ;
                ResponseAPI.header.url     = req.url;
                ResponseAPI.header.message = "Não foi possível listar os câmbios!";
                ResponseAPI.header.error   = err;
                ResponseAPI.data           = [];
            }else{
                ResponseAPI.header.url     = req.url;
                ResponseAPI.data           = modelos;
                res.status(200).json(ResponseAPI);
            }
        }, query);
    }

    controller.findUf = function(req, res, next) {
        var query       = {situacao : true};
        var ResponseAPI = createResponseAPI();
        uf.findByQuery(function(err, ufs){
            if(err){
                ResponseAPI.header.status  = 500 ;
                ResponseAPI.header.url     = req.url;
                ResponseAPI.header.message = "Não foi possível listar as ufs!";
                ResponseAPI.header.error   = err;
                ResponseAPI.data           = [];
            }else{
                ResponseAPI.header.url     = req.url;
                ResponseAPI.data           = ufs;
                res.status(200).json(ResponseAPI);
            }
        }, query);
    }
    
 
    return controller; 
};   
