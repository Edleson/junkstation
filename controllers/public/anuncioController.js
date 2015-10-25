module.exports = function(app) {
    var htmlMinify = app.get("html-minify");
    var User       = app.models.admin.user;
    var marca      = new app.models.admin.marca({});
    var uf         = new app.models.admin.uf({});
    var moment     = app.get("moment");       
    var controller = {};

    controller.criarAnuncioGET = function(req, res, next) {
        htmlMinify('criar_anuncio', res , {});
    };

    controller.criarAnuncioPOST = function(req, res, next) {
        req.flash('cadastroAnuncio', '<div class="alert-success">Anúncio cadastrado com sucesso</div>');
        console.log(req.form);
        req.form.complete(function(err, fields, files){
            console.log(fields);
            if (err) {
                console.log(err);
                next(err);
            } else {
                console.log('\nuploaded %s to %s', files.image.filename, files.image.path);
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
                    res.render('meus_dados', {response : response });
                }else{
                    req.flash('cadastro', '<div class="alert-success">Dados salvos com sucesso :) </div>');
                    res.render('meus_dados', {response : response });
                }
            }, query);
        })
    };
    
    return controller; 
};   
