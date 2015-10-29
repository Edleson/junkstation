module.exports = function(app) {
    var Utils       = app.util.utils;
    var htmlMinify  = app.get("html-minify");
    var fileHandler = app.get("fileHandler");
    var User        = app.models.admin.user;
    var Anuncio     = app.models.public.anuncio;
    var marca       = new app.models.admin.marca({});
    var uf          = new app.models.admin.uf({});
           
    var controller  = {};

    controller.meusAnuncios = function(req, res, next) {
        var query       = {user : req.user._id};
        var AnuncioDao  = new Anuncio({});
        AnuncioDao.findByQuery(function(err, anuncios){
            if(err){
                req.flash('meusAnuncios', '<div class="alert-error">Não foi possível listar os seus anuncios :( </div>');
                htmlMinify('meus_anuncios', res , {response : []});
            }else{
                //console.log(anuncios)
                if(anuncios.length === 0 ){
                    req.flash('meusAnuncios', '<div class="alert-info">Você ainda não possível nenhum anúncio cadastrdo</div>');
                }
                htmlMinify('meus_anuncios', res , {response : anuncios});
            }
        }, query);
    };

    controller.criarAnuncioGET = function(req, res, next) {
        htmlMinify('criar_anuncio', res , {});
    };

    controller.criarAnuncioPOST = function(req, res, next) {
        var post = req.body;
        var anuncio = validateAnuncio(post);
        
        Anuncio.create(anuncio , function(error, response){
            if(error){
                req.flash('cadastro', '<div class="alert-error">Não foi possível salvar os dados do seu perfil :( </div>');
                htmlMinify('criar_anuncio', res , {});
            }else{
                //console.log(response);
                var callback = function(error, responseAWS, idAnuncio){
                    if(error){
                        console.log(JSON.stringify(error));
                    }else{
                        console.log(JSON.stringify(responseAWS));
                    }
                };
                fileHandler.uploadMultiploFile(req, response._id, callback);
                req.flash('cadastroAnuncio', '<div class="alert-success">Anúncio cadastrado com sucesso</div>');
                htmlMinify('criar_anuncio', res , {});
            }
        });
    };

    controller.cadastroPerfilGET = function(req, res, next){
        var query          = {situacao : true};
        var response = {
            ufs : []
        };
       
        uf.findByQuery(function(err, ufs){
            response.ufs = ufs;
            //htmlMinify('meus_dados', res, {response : response }); 
            res.render('meus_dados', {response : response });
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
                    //htmlMinify('meus_dados', res, {response : response });
                    res.render('meus_dados', {response : response });
                }else{
                    req.flash('cadastro', '<div class="alert-success">Dados salvos com sucesso :) </div>');
                    //htmlMinify('meus_dados', res, {response : response });
                    res.render('meus_dados', {response : response });
                }
            }, query);
        })
    };

    function validateAnuncio(anuncio){
        anuncio.data_anuncio    = Utils.moment(anuncio.data_anuncio, "DD/MM/YYYY");
        anuncio.data_vencimento = Utils.moment(anuncio.data_vencimento, "DD/MM/YYYY");
        anuncio.preco           = Utils.unFormatMoeda(anuncio.preco);
        return anuncio;
    }
    
    return controller; 
};   
