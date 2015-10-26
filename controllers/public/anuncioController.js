module.exports = function(app) {
    var htmlMinify  = app.get("html-minify");
    var fileHandler = app.get("fileHandler");
    var User        = app.models.admin.user;
    var marca       = new app.models.admin.marca({});
    var uf          = new app.models.admin.uf({});
    var moment      = app.get("moment");       
    var controller  = {};

    controller.criarAnuncioGET = function(req, res, next) {
        htmlMinify('criar_anuncio', res , {});
    };

    controller.criarAnuncioPOST = function(req, res, next) {
        req.flash('cadastroAnuncio', '<div class="alert-success">Anúncio cadastrado com sucesso</div>');
        var callback = function(error, responseAWS, idAnuncio){
            if(error){
                console.log(JSON.stringify(error));
            }else{
                console.log(JSON.stringify(responseAWS));
            }
        };
        console.log(callback);
        fileHandler.uploadMultiploFile(req, "¨66768964826374", callback);
        htmlMinify('criar_anuncio', res , {});
    };

    controller.cadastroPerfilGET = function(req, res, next){
        var query          = {situacao : true};
        var response = {
            ufs : []
        };
       
        uf.findByQuery(function(err, ufs){
            response.ufs = ufs;
            htmlMinify('meus_dados', res, {response : response }); 
        }, query);
    };

    controller.cadastroPerfil = function(req, res, next){
        var _user          = req.user;
        var _dadosPessoais = req.body;
        var query          = {situacao : true};
        var data           = moment(_dadosPessoais.dataNascimento, "DD/MM/YYYY");
        _dadosPessoais.dataNascimento = data;
        _user.dadosPessoais = _dadosPessoais;
        var Repository = new User(_user);
        User.update({_id : _user.id}, _user, function(error, user){
            var response = {
                ufs : []
            };

            uf.findByQuery(function(err, ufs){
                response.ufs = ufs;
                if(error){
                    console.log(error)
                    req.flash('cadastro', '<div class="alert-error">Não foi possível salvar os dados do seu perfil :( </div>');
                    htmlMinify('meus_dados', res, {response : response });
                }else{
                    req.flash('cadastro', '<div class="alert-success">Dados salvos com sucesso :) </div>');
                    htmlMinify('meus_dados', res, {response : response });
                }
            }, query);
        })
    };
    
    return controller; 
};   
