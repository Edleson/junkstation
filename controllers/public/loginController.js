module.exports = function(app) {
    var htmlMinify        = app.get("html-minify");
    var User              = app.models.admin.user;
    var createResponseAPI = app.models.admin.responseAPI;
    var security          = app.get("security");
    var emailSender       = app.get("emailSender"); 
    var controller        = {};

    var sendEmail = function(req, user){
        var host = req.headers.host;
        var url  = "/login/alterarsenha/";
        var link = "https://" + host + url;
        /*******************************************************
         * Envia um e-mail com um link para realizar a troca da*
         * senha do usuário.                                   *
         *******************************************************/
        var uri  = security.cryptHexNumber(user._id);
        var destination = {
            email : user.local.email ,
            data  : {
                username : user.local.username , 
                link     : link + uri
            }
        };

        emailSender.sendNewPassword(destination, function(error , info){
            if(error){
                console.log(error);
            }else{
                console.log(info);                
            }
        });
    };

    controller.recuperarSenha = function(req, res, next) {
        var ResponseAPI = createResponseAPI();
        var query = {"local.email" : req.body.email};
        var Repository = new User({});
        Repository.findByQuery(function(err, user){
            if(err){
                ResponseAPI.header.status  = 500 ;
                ResponseAPI.header.url     = req.url;
                ResponseAPI.header.message = "Não foi possível resgatar a sua senha! Tente novamente :(";
                ResponseAPI.header.error   = error;
                ResponseAPI.data           = {};
                console.log(err);
                res.status(500).json(ResponseAPI);
            }else{
                var mensage = "<div class='alert-success'>Enviamos um e-mail com instruções para recuperar a sua senha :)</div>";
                if(user.length == 0){
                    mensage = "<div class='alert-error'>Não encontramos nenhum usuário cadastrado com o e-mail informado</div>";
                }else{
                    sendEmail(req , user[0]);
                }
                ResponseAPI.header.url     = req.url;
                ResponseAPI.data           = mensage ;
                res.status(200).json(ResponseAPI);
            }
        }, query);
    };

    controller.confirmaCadastro = function(req, res, next) {
        var id = req.params.id;
        User.update({_id : security.decryptHexNumber(id)}, {contaAtiva : true}, { multi: false }, function(error, user){
            if(error){
               next(error)
            }else{
                htmlMinify('confirma_cadastro', res , {usuario : user});
            }
        });     
    };

    controller.alterarSenha = function(req, res, next) {
        var ResponseAPI = createResponseAPI();
        var id    = req.body.id;
        var senha = req.body.password;
        var hash  = new User({});
        User.update({_id : id }, {"local.password" : hash.generateHash(senha)} , { multi: false }, function(error, user){
            if(error){
                ResponseAPI.header.status   = 500 ;
                ResponseAPI.header.url     = req.url;
                ResponseAPI.header.message = "Não foi possível alterar a senha!";
                ResponseAPI.header.error   = error;
                ResponseAPI.data           = {};
                res.status(500).json(ResponseAPI);
            }else{
               var mensage = "<div class='alert-success'>Sua senha foi alterada com sucesso</div>";
                if(user.length == 0){
                    mensage = "<div class='alert-error'>Oops! Não conseguimos alterar a senha! Tente novamente. Se o erro persiste contate o administrador!</div>";
                }
                ResponseAPI.header.url     = req.url;
                ResponseAPI.data           = mensage ;
                res.status(200).json(ResponseAPI);
            }
        });   
    };

    return controller; 
};   
