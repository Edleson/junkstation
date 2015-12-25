module.exports = function(app) {
    var htmlMinify        = app.get("html-minify");
    var Assinatura        = app.models.admin.assinatura;
    var Anuncio           = app.models.public.anuncio;
    var controller        = {}; 

    controller.listarAssinaturaByUser = function(req, res, next) {
        htmlMinify('lista_assinatura', res , {});
    };

    controller.findAssinaturaById = function(req, res, next) {
        htmlMinify('detalhe_assinatura', res , {});
    };

    controller.renovarAssinatura = function(req, res, next) {
        var assinatura = req.user.assinatura;
        var userID     = req.user._id;
        /*****************************************************************
         * Atualiza o status de vencido do Modelo de assinatura          *
         *****************************************************************/
        Assinatura.update({_id : assinatura._id}, {vencido : false }, function(error, isOK){
            if(error){
                console.log("Ocorreu um erro durante a atualização da assinatura assinaturaController.renovarAssinatura()");
            }
            console.log("Assinatura atualizada com sucesso ! assinaturaController.renovarAssinatura()");
            console.log(isOK);
        });

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