module.exports = function(app) {
    var htmlMinify     = app.get("html-minify");
    var Assinatura     = app.models.admin.assinatura;
    var User           = app.models.admin.user;
    var Anuncio        = app.models.public.anuncio;
    var plano          = new app.models.admin.plano({}); 
    var pagseguroUtil  = app.util.pagseguroUtil;
    var controller   = {}; 

    controller.listarAssinaturaByUser = function(req, res, next) {
        var user    = req.user;
        var query  = {situacao : true};
        Assinatura.find({user : user._id}).deepPopulate('plano').sort({inicio_vigencia : -1}).exec(function(error, assinaturas){
            if(error){
                next(error);
            }else{
                params = {
                    assinaturas   : assinaturas     ,
                    pagseguroUtil : pagseguroUtil   ,
                    planos        :  []
                };

                plano.findByQuery(function(error, planos ){
                    params.planos = planos;
                    htmlMinify('assinatura_listar', res , {params : params});
                }, query);
                
            }
        });
    };

    controller.findAssinaturaById = function(req, res, next) {
        var id = req.params.id;

        Assinatura.findById(id).deepPopulate('plano').exec(function(error, assinatura){
            if(error){
                next(error);
            }else{
                params = {
                    assinatura    : assinatura      ,
                    pagseguroUtil : pagseguroUtil   
                };
                htmlMinify('partials/assinatura_detalhe', res , {params : params});
            }
        });       
    };

    controller.cancelarAssinatura = function(req, res, next) {
        var id     = req.params.id;
        var userId = req.user._id; 
        Assinatura.findById(id).deepPopulate('plano').exec(function(error, assinatura){
            if(error){
                next(error);
            }else{
                /*****************************************************************
                 * Atualiza o status para cancelado pelo cliente.                *
                 *****************************************************************/
                assinatura.status       = 21;    // 21 - Cancelado pelo Cliente
                assinatura.vencido      = false; // muda a flag de expirado.
                assinatura.fim_vigencia = new Date();
                assinatura.historico.push({
                    tipoEvento       : "CANCELAMENTO ASSINATURA"    ,
                    descricaoEvento  : "Assinatura cancelada pelo cliente."
                });

                /*****************************************************************
                 * Atualiza o status da assinatura na base de dados              *
                 *****************************************************************/
                Assinatura.update({_id : id}, assinatura, function(error, isOK){
                    if(error){
                        console.log("Ocorreu um erro durante o cancelamento da assinatura. -> AssinaturaController.cancelarAssinatura()");
                        console.log(error);
                    }
                    console.log("Assinatura cancelada com sucesso!. -> AssinaturaController.cancelarAssinatura() ");
                    console.log(isOK); 
                });
                
                /*****************************************************************
                 * Atualiza os anúncios do usuário para que não aparecam mais na *
                 *nos mecanismos de busca                                        *
                 *****************************************************************/
                var anuncioUpd = {data_vencimento : assinatura.fim_vigencia , status : false };
                Anuncio.update({user : userId}, anuncioUpd, function(error, isOK){
                    if(error){
                        console.log("Ocorreu um erro durante a atualização dos anúncios -> AssinaturaController.cancelarAssinatura()");
                        console.log(error);  
                    }
                    console.log("Anúncios atualizados com sucesso -> AssinaturaController.cancelarAssinatura() ");
                    console.log(isOK); 
                });

                /*****************************************************************
                 * Atualiza os dados do usuário                                  *
                 *****************************************************************/
                req.user.plano      = null;
                req.user.assinatura = null;
                User.update({_id : userId}, req.user, function(error, isOK){
                    if(error){
                        console.log("Ocorreu um erro durante a atualização do usuário -> AssinaturaController.cancelarAssinatura()");
                        console.log(error);  
                    }
                    console.log("Usuário atualizado com sucesso! -> AssinaturaController.cancelarAssinatura()");
                    console.log(isOK); 
                 });

                 res.redirect("/assinatura/listar");
            }
        });
    };

    controller.renovarAssinatura = function(req, res, next) {
        var assinatura = req.user.assinatura;
        var userID     = req.user._id;
        /*****************************************************************
         * Atualiza o status de vencido do Modelo de assinatura          *
         *****************************************************************/
        /*Assinatura.update({_id : assinatura._id}, {vencido : false }, function(error, isOK){
            if(error){
                console.log("Ocorreu um erro durante a atualização da assinatura assinaturaController.renovarAssinatura()");
            }
            console.log("Assinatura atualizada com sucesso ! assinaturaController.renovarAssinatura()");
            console.log(isOK);
        });*/

        /*****************************************************************
         * Atualiza os anuncios com a nova data de vencimento            *
         *****************************************************************/
        Anuncio.update({user : userID}, {data_vencimento : assinatura.fim_vigencia}, {multi : true}, function(error, isOK){
            if(error){
                console.log("Ocorreu um erro durante a atulização dos anuncios durante a renovação da assinatura!assinaturaController.renovarAssinatura()");
            }
            console.log("Anuncios atualizados com sucesso ! assinaturaController.renovarAssinatura()");
            console.log(isOK);
        });
    };

    return controller; 
}; 