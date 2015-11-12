var path = require('path');
var fs   = require('fs');
var gm   = require('gm').subClass({imageMagick: true});
var del  = require("del");

module.exports = function(app) {
    var context     = app.get("context");
    var Utils       = app.util.utils;
    var htmlMinify  = app.get("html-minify");
    var fileHandler = app.get("fileHandler");
    var paginate    = app.get("paginate");
    var emailSender = app.get("emailSender");
    var User        = app.models.admin.user;
    var Anuncio     = app.models.public.anuncio;
    var marca       = new app.models.admin.marca({});
    var plano       = new app.models.admin.plano({}); 
    var uf          = new app.models.admin.uf({});
    var paginateNum = 10 ;      
    var controller  = {};

    controller.meusAnuncios       = function(req, res, next){ 
        listarAnuncioByUser(req, res, next, false);
    };

    controller.criarAnuncioGET    = function(req, res, next){
        htmlMinify('criar_anuncio', res , {}); 
    };

    controller.pesquisaAnuncio    = function(req, res, next){
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

    controller.listAnuncioGET     = function(req, res, next){
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

    controller.listAnuncioGridGET = function(req, res, next){
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

    controller.anuncioDetalheGET  = function(req, res, next){
        var id = req.params.id;
        Anuncio.findById(id).deepPopulate("user plano").exec(function(error, anuncio){
            if(error){
                next(error);
            }else{
                htmlMinify('anuncio_detalhe', res , {anuncio : anuncio});
            }
        });
    };

    controller.criarAnuncioPOST   = function(req, res, next){
        var post = req.body;
        var anuncio = validateAnuncio(post);
        Anuncio.create(anuncio , function(error, _anuncio){
            if(error){
                req.flash('cadastro', '<div class="alert-error">Não foi possível salvar os dados do seu perfil :( </div>');
                htmlMinify('criar_anuncio', res , {});
            }else{
                var callback = getCallbackUpload(context);
                fileHandler.uploadMultiploFile(req, _anuncio, callback);
                req.flash('cadastroAnuncio', '<div class="alert-success">Anúncio cadastrado com sucesso</div>');
                req.session.countAnuncio = req.session.countAnuncio + 1 ;
                htmlMinify('criar_anuncio', res , {});
            }
        });
    };

    controller.deletarAnuncio     = function(req, res, next){
        var id         = req.body.id;
        var anuncioDir = '../../public/tmp/anuncio/' + id;

        del(path.join(__dirname, anuncioDir)).then(function(paths){
            console.log('Deleted files/folders:\n', paths.join('\n'));
        });
        
        /*fs.rmdir(path.join(__dirname, anuncioDir), function(error){
            console.log(error);
            if(error){
                console.log("Ocorreu um erro durante a exclusão do diretório de medias do anúncio : " + id);
            }
        });*/

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

    controller.cadastroPerfilGET  = function(req, res, next){
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

    controller.cadastroPerfil     = function(req, res, next){
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
                //res.render('meus_anuncios', {response : anuncios});
            }
        }, query);
    };

    function validateAnuncio(anuncio){
        anuncio.data_anuncio    = Utils.moment(anuncio.data_anuncio, "DD/MM/YYYY");
        anuncio.data_vencimento = Utils.moment(anuncio.data_vencimento, "DD/MM/YYYY");
        anuncio.preco           = Utils.unFormatMoeda(anuncio.preco);
        return anuncio;
    };

    function getCallbackUpload(context){
        if(context.storage.storageType === context.storage.localStorage.nome){
            var callback  = function(req, anuncio){
                var watermark =  path.join(__dirname, "../../public/real_images" , "watermark.png");
                var tempDir   = '../../public/tmp/anuncio/';
                var medias    = [];
                var files     = req.files;
                var media     = {};
                var id        = anuncio._id;
                var prefix    = req.protocol + "://" + req.headers.host + "" + context.storage.localStorage.prefix;
                prefix        = prefix + "anuncio/" + id + "/";
                tempDir       = tempDir + id;                 
               /*******************************************************
                * Verifica se existe o diretório com ID do Anuncio    *
                *******************************************************/
                fs.exists(tempDir, function (exists) {
                   /*******************************************************
                    * Casso do diretório não exista cria o diretório      *
                    *******************************************************/
                    if(!exists){
                        fs.mkdirSync(path.join(__dirname, tempDir));
                    }

                    /*******************************************************
                    * Recupera a lista de imagens enviadas na requisição   *
                    *******************************************************/
                    if(files){
                        var contador = 0;
                        files.forEach(function(file){
                            var nomeArquivo = id + file.originalname;
                            var media = {
                                prefix  : prefix                    ,
                                nome    : nomeArquivo               ,
                                tipo    : file.mimetype             ,
                                tamanho : file.size
                            };

                            /*******************************************************
                             * Recupera a foto principal do anúncio                *
                             *******************************************************/
                            if(contador === 0){
                                anuncio.fotoPrincipal = media;
                            }else{
                                anuncio.demaisFotos.push(media);
                            }

                            /*******************************************************
                             * Aplica a marca d'água da junk caso esteja configurado*
                             *******************************************************/
                            if(context.watermark){
                                gm(file.buffer, file.originalname)
                                .draw(['image Over 0,0 0,0 "'+ watermark + '"' ])
                                .write(path.join(__dirname, tempDir , nomeArquivo), function (err) {
                                    if (err){
                                        console.log(err);  
                                    }
                                });    
                            }else{
                                 gm(file.buffer, file.originalname).write(path.join(__dirname, tempDir , nomeArquivo), function (err) {
                                    if (err){
                                        console.log(err);  
                                    }
                                }); 
                            }
                            contador++;     
                        });
                        
                       /*******************************************************
                        * Atualiza o anúncio com a localização da foto        *
                        *******************************************************/
                        Anuncio.update({"_id" : id}, anuncio , function(error){
                            if(error){
                                console.log(error);
                            }

                            sendEmailNewAnuncio(req, anuncio);

                        }); 
                    } 

                });

                
            }

            return callback;
        }else if(context.storage.storageType === context.storage.s3Storage.nome){
           
        }else{
            throw new Error("Não foi definida nenhuma estratégia de armazenamento de arquivos! Revise o arquivo de configuração context.js.");
        }
    };

    function sendEmailNewAnuncio(req, anuncio){
        var user          = req.user;
        var host          = req.headers.host;
        var link_servico  = "http://" + host + "/servico";
        var url_imagem    = "https://" + host + "/dist/images/dot.gif";
        var meus_anuncios = "https://" + host + "/anuncio/meusanuncios";

        /*******************************************************
         * Envia um e-mail com as informações do anúncio       *
         *******************************************************/
        var destination = {
            email : user.local.email ,
            data  : {
                anuncio   : anuncio       , 
                servico   : link_servico  ,
                imagem    : url_imagem    ,
                url_admin : meus_anuncios
            }
        };

        emailSender.sendNewAnuncio(destination, function(error , info){
            if(error){
                console.log(error);
            }else{
                console.log(info);                
            }
        });
    };
 
    return controller; 
};   
