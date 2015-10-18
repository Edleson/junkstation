module.exports = function(app) {
    var User       = app.models.admin.user;
    var uf         = new app.models.admin.uf({});
    var moment     = app.get("moment");       
    var controller = {};

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
