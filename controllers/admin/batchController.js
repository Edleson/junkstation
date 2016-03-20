
module.exports = function(app) {
    var later       = require('later');
    var emailSender = app.get("emailSender");
    var context     = app.get("context");
    var Utils       = app.util.utils;
    var Assinatura  = app.models.admin.assinatura;
    var Anuncio     = app.models.public.anuncio;
    var controller  = {};

    controller.start = function(req, res, next) {
        console.log("Iniciando o processamento das rotinas BATCH");
        /*****************************************************************
         * Seta o timezone local                                         *
         *****************************************************************/
        later.date.localTime();
        /******************************************************************
         * Lista todas as assinaturas expiradas e muda o status da assina *
         * tura para em ronavação e envia um e-mail para o cliente esse   *
         * JOB roda todos os dias as 06:00 da manhã.                      *        
         *****************************************************************/
        assinaturasExpiradas();
        /******************************************************************
         * Esse JOB tem a finalidade de enviar um e-mail informativo para *
         *os clientes avisando que a assinatura vai expirar em alguns dias*
         *esse JOB roda todos os dias as 01:00 da manhã.                  *        
         *****************************************************************/
        //avisoAssinaturaExperidas();
    };

    function  assinaturasExpiradas(){
        var schedule = later.parse.cron('0 0 5 1/1 * ? *', true);
        var action = later.setInterval(function(){
            /*****************************************************************
             * Inicio do processamento da JOB                                *
             *****************************************************************/
            var dataInicioPR = Utils.moment().format("dddd, MMMM Do YYYY, h:mm:ss a");
            /*****************************************************************
             * Datas de corte para a pesquisa da query                       *
             *****************************************************************/
            var dataHoje  = new Date();
            /*****************************************************************
             * Monta a query para realizar a pesquisa. A pesquisa só buscará *
             *assinaturas com status 3 ou 4 que ainda estão ativas.          *
             *****************************************************************/
            var query = {
                fim_vigencia : {$lt : dataHoje} ,
                status       : {$in : [3, 4]}
            }
            /*****************************************************************
             * Realiza a pesquisa                                            *
             *****************************************************************/
            Assinatura.find(query).deepPopulate('plano user').exec(function(error, assinaturas){
                if(error){
                    //COLOCAR UMA LÓGICA PARA ENVIAR EMAIL EM CASO DE ERROR
                    console.log(error);
                }else{
                    var length = assinaturas.length;
                    /*****************************************************************
                     * Atualiza o status de todas as assinturas vencidas             *
                     *****************************************************************/
                    assinaturas.forEach(function(item){
                        var email    = item.user.local.email;

                        item.status  = 20;
                        item.vencido = true;
                        item.historico.push({
                            tipoEvento       : "ASSINATURA VENCIDA"    ,
                            descricaoEvento  : "Sua assinatura venceu dia " + Utils.moment(item.fim_vigencia).format("L")
                        });

                        /*****************************************************************
                         * Atualiza o status da assinatura na base de dados              *
                         *****************************************************************/
                        Assinatura.update({_id : item._id}, item, function(error, isOK){
                            if(error){
                                console.log("Ocorreu um erro durante o atualização da assinatura. -> batchController.assinaturasExpiradas()");
                                console.log(error);
                                //Envia um email administrativo
                            }
                            /*****************************************************************
                             * Envia um e-mail informando o vencimento da assinatura         *
                             *****************************************************************/
                            sendEmailAssinaturaExperida(email);
                        });

                        var anuncioInvalido = {
                            status          : false         ,
                            data_vencimento : new Date()
                        }
                        /*********************************************************
                        * Caso o pagamento não seja efetuado inválida os anuncios*
                        **********************************************************/
                        Anuncio.update({assinatura : item._id}, anuncioInvalido, {multi : true}, function(error, isOK){
                            if(error){
                                console.log("Ocorreu um erro durante a atualização dos dos dos anúncios. -> batchController.assinaturasExpiradas()");
                            }else{
                                console.log("Dados dos anuncios atualizado com sucesso -> batchController.assinaturasExpiradas()");
                                console.log(isOK);
                            }
                        });
                        console.log("Fim o processamento de assinaturas vencidas " + new Date());
                    });
                }
            });
        }, schedule);
    }

    function  avisoAssinaturaExperidas(){
        var schedule = later.parse.cron('0 36 18 1/1 * ? *', true);
        var action = later.setInterval(function(){
            console.log("Aviso de assinaturas Expiridas : " + new Date());
        }, schedule);
    }

    function sendEmailAssinaturaExperida(email, assinatura){
        var host = "www.pontoclass.com";
        var url  = "/assinatura/listar";
        var link = "https://" + host + url;

        var destination = {
            email : email ,
            data  : {
                link : link
            }
        };

        emailSender.sendAssinaturaExpirada(destination, function(error , info){
            if(error){
                console.log(error);
            }else{
                console.log(info);                
            }
        });

    }

    /*****************************************************************
     * Inicia o agendamento dos JOBs                                 *
     *****************************************************************/
    controller.start();

    return controller; 
};   
