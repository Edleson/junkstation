module.exports = function(app) {
    var htmlMinify        = app.get("html-minify");
    var emailSender       = app.get("emailSender");
    var Newsletter        = app.models.admin.newsletter;
    var controller        = {};
    var createResponseAPI = app.models.admin.responseAPI;  

    controller.create = function(req, res, next) {
        var entity = req.body;
        var ResponseAPI = createResponseAPI();
        Newsletter.findOrCreate(entity, function(error, _entity, created){
            if(error){
                ResponseAPI.header.status  = 500 ;
                ResponseAPI.header.url     = req.url;
                ResponseAPI.header.message = '<div class="alert-error">Ocorreu um erro durante a inclusão da newsletter</div>';
                ResponseAPI.header.error   = error;
                res.status(500).json(ResponseAPI);
            }else{
                ResponseAPI.header.url     = req.url;
                if(created){
                    var host = req.headers.host;
                    var url  = "/newsletter/delete/" + _entity._id ;
                    var link = "https://" + host + url;
                    
                    var destination = {
                        email : _entity.email ,
                        data  : {
                            nome : _entity.nome , 
                            link : link
                        }
                    };

                    emailSender.sendNewsletter(destination, function(error , info){
                        if(error){
                            console.log(error);
                        }else{
                            console.log(info);                
                        }
                    });

                    ResponseAPI.header.message = '<div class="alert-success">Você foi cadastrado com sucesso na newletter</div>';

                }else{
                    ResponseAPI.header.message = '<div class="alert-success">Você já é cadastrado em nossa newsletter</div>';
                }
                ResponseAPI.data           = _entity
                res.status(201).json(ResponseAPI);
            }
        });
    }

    controller.remove = function(req, res, next) {
        var id = req.params.id;
        var ResponseAPI = createResponseAPI();
        Newsletter.remove({"_id" : id}, function(error){
            if(error){
                return next(error);
            }else{
                 htmlMinify('cancela-newsletter', res , {});
            }
        });
    }

    return controller; 
};   