module.exports = function(app) {
    var Utils       = app.util.utils;
    var htmlMinify  = app.get("html-minify");
    var fileHandler = app.get("fileHandler");
    var paginate    = app.get("paginate");
    var User        = app.models.admin.user;
    var Anuncio     = app.models.public.anuncio;
    var marca       = new app.models.admin.marca({});
    var plano       = new app.models.admin.plano({}); 
    var uf          = new app.models.admin.uf({});
    var paginateNum = 10 ;

           
    var controller  = {};

    controller.meusAnuncios = function(req, res, next) {
        listarAnuncioByUser(req, res, next, false);
    };

    controller.criarAnuncioGET = function(req, res, next) {
        htmlMinify('criar_anuncio', res , {});
    };

    controller.pesquisaAnuncio = function(req, res, next) {
        var paginateOption = {
            page     : req.query.page   ,
            limit    : req.query.limit  ,
            columns  : null   ,
            sortBy   : null   ,
            populate : "user" ,
            lean     : null
        };

        var search = req.body;

        console.log(search);

        Anuncio.paginate(search, paginateOption, function(error, anuncios, pageCount, itemCount){
            if(error){
                next(error);
            }else{
                var response = {
                    anuncios  : anuncios  , 
                    pageCount : pageCount , 
                    itemCount : itemCount ,
                    pages     : paginate.getArrayPages(req)(paginateNum, pageCount, req.query.page)
                }

                if(req.query.ajax){
                    htmlMinify('partials/listaAnuncios', res , response);
                }else{
                    htmlMinify('anuncio_lista', res , response);
                }
                
            }
        });
    };

    controller.listAnuncioGET = function(req, res, next) {
        var paginateOption = {
            page     : req.query.page   ,
            limit    : req.query.limit  ,
            columns  : null   ,
            sortBy   : null   ,
            populate : "user" ,
            lean     : null
        };
       
        Anuncio.paginate({status : true}, paginateOption, function(error, anuncios, pageCount, itemCount){
            if(error){
                next(error);
            }else{
                var response = {
                    anuncios  : anuncios  , 
                    pageCount : pageCount , 
                    itemCount : itemCount ,
                    pages     : paginate.getArrayPages(req)(paginateNum, pageCount, req.query.page)
                }

                if(req.query.ajax){
                    htmlMinify('partials/listaAnuncios', res , response);
                }else{
                    htmlMinify('anuncio_lista', res , response);
                }
                
            }
        });
    };

    controller.listAnuncioGridGET = function(req, res, next) {
        var paginateOption = {
            page     : req.query.page   ,
            limit    : req.query.limit  ,
            columns  : null   ,
            sortBy   : null   ,
            populate : "user" ,
            lean     : null
        };
       
        Anuncio.paginate({status : true}, paginateOption, function(error, anuncios, pageCount, itemCount){
            if(error){
                next(error);
            }else{
                var response = {
                    anuncios  : anuncios  , 
                    pageCount : pageCount , 
                    itemCount : itemCount ,
                    pages     : paginate.getArrayPages(req)(paginateNum, pageCount, req.query.page)
                }
                if(req.query.ajax){
                    htmlMinify('partials/gridAnuncio', res , response);
                }else{
                    htmlMinify('anuncio_grid', res , response);
                }
            }
        });
       
    };

    controller.anuncioDetalheGET = function(req, res, next) {
        var id = req.params.id;
        Anuncio.findById(id).deepPopulate("user plano").exec(function(error, anuncio){
            if(error){
                next(error);
            }else{
                htmlMinify('anuncio_detalhe', res , {anuncio : anuncio});
            }
        });
    };

    controller.criarAnuncioPOST = function(req, res, next) {
        var post = req.body;
        var anuncio = validateAnuncio(post);
        Anuncio.create(anuncio , function(error, response){
            if(error){
                req.flash('cadastro', '<div class="alert-error">Não foi possível salvar os dados do seu perfil :( </div>');
                htmlMinify('criar_anuncio', res , {});
            }else{
                var callback = function(error, responseAWS, idAnuncio){
                    if(error){
                        console.log(JSON.stringify(error));
                    }else{
                        console.log(JSON.stringify(responseAWS));
                    }
                };
                fileHandler.uploadMultiploFile(req, response._id, callback);
                req.flash('cadastroAnuncio', '<div class="alert-success">Anúncio cadastrado com sucesso</div>');
                req.session.countAnuncio = req.session.countAnuncio + 1 ;
                htmlMinify('criar_anuncio', res , {});
            }
        });
    };

    controller.deletarAnuncio = function(req, res, next) {
        var id = req.body.id;
        Anuncio.remove({"_id" : id}, function(error){
            if(error){
                req.flash('deleteAnuncio', '<div class="alert-error">Não foi possível excluir o Anúncio :( </div>');
                listarAnuncioByUser(req, res, next, false);
            }else{
                req.flash('deleteAnuncio', '<div class="alert-success">Anúncio excluído com sucesso</div>');
                listarAnuncioByUser(req, res, next, false);
            }
        });
    };

    controller.cadastroPerfilGET = function(req, res, next){
        var query          = {situacao : true};
        var response = {
            ufs    : [] ,
            planos : []
        };
       
        uf.findByQuery(function(err, ufs){
            response.ufs = ufs;
            plano.findByQuery(function(error, planos ){
                response.planos = planos;
                res.render('meus_dados', {response : response });
            }, query);
        }, query);
    };

    controller.cadastroPerfil = function(req, res, next){
        var _user          = req.user;
        var _dadosPessoais = req.body;
        var query          = {situacao : true};
        var data           = Utils.moment(_dadosPessoais.dataNascimento, "DD/MM/YYYY");
        _dadosPessoais.dataNascimento = data;
        _user.dadosPessoais = _dadosPessoais;
        _user.plano = _dadosPessoais.plano;
        var Repository = new User(_user);
        User.update({_id : _user.id}, _user, function(error, user){
            var response = {
                ufs : [] 
            };

            uf.findByQuery(function(err, ufs){
                response.ufs = ufs;
                plano.findByQuery(function(_error, planos ){
                    response.planos = planos;
                    if(error){
                        req.flash('cadastro', '<div class="alert-error">Não foi possível salvar os dados do seu perfil :( </div>');
                        res.render('meus_dados', {response : response });
                    }else{
                        req.flash('cadastro', '<div class="alert-success">Dados salvos com sucesso :) </div>');
                        res.render('meus_dados', {response : response });
                    }
                }, query);
            }, query);
        })
    };

    function listarAnuncioByUser(req, res, next, isDelete){
        var query       = {user : req.user._id};
        var AnuncioDao  = new Anuncio({});
        AnuncioDao.findByQuery(function(err, anuncios){
            if(err){
                req.flash('meusAnuncios', '<div class="alert-error">Não foi possível listar os seus anuncios :( </div>');
                htmlMinify('meus_anuncios', res , {response : []});
            }else{
                if(anuncios.length === 0 ){
                    req.flash('meusAnuncios', '<div class="alert alert-info" role="alert">Você ainda não possível nenhum anúncio cadastrado</div>');
                }
                req.session.countAnuncio = anuncios.length;
                htmlMinify('meus_anuncios', res , {response : anuncios}); 
            }
        }, query);
    };

    function validateAnuncio(anuncio){
        anuncio.data_anuncio    = Utils.moment(anuncio.data_anuncio, "DD/MM/YYYY");
        anuncio.data_vencimento = Utils.moment(anuncio.data_vencimento, "DD/MM/YYYY");
        anuncio.preco           = Utils.unFormatMoeda(anuncio.preco);
        return anuncio;
    }
    
    return controller; 
};   
