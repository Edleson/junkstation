
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
         * Configura um o envio de um e-mail administrativo              *
         *****************************************************************/
        var titulo = "Email administrativo Junkstation";
        var descricao = "Esse e-mail é um aviso que o processamento batch foi iniciado com sucesso.";
        sendAdminMail(null, titulo, descricao, null, null);
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
        //var schedule = later.parse.cron('0 0/1 * 1/1 * ? *', true);
        var action   = later.setInterval(function(){
            /*****************************************************************
             * Inicio do processamento da JOB                                *
             *****************************************************************/
            var dataInicioPR = Utils.moment().format("dddd, DD [de] MMMM [de] YYYY, h:mm:ss a");
            /*****************************************************************
             * Envia um e-mail informando que esse JOB foi iniciado             *
             *****************************************************************/
            var titulo = "JOB [assinaturasExpiradas()] iniciado";
            var descricao = "JOB [assinaturasExpiradas()] foi iniciado " + dataInicioPR;
            sendAdminMail(null, titulo, descricao, null, null);

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
            var length = 0;
            Assinatura.find(query).deepPopulate('plano user').exec(function(error, assinaturas){
                if(error){
                    descricao = "Ocorreu um erro durante o processamento do JOB [assinaturasExpiradas()]" + error;
                    sendAdminMail(null, titulo, descricao, null, null);
                    console.log(error);
                }else{
                    length = assinaturas.length;
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
                            sendEmailAssinaturaExperida(email, item);
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

                    var dataFimPR = Utils.moment().format("dddd, DD [de] MMMM [de] YYYY, h:mm:ss a");
                    titulo    = "JOB [assinaturasExpiradas()] finalizado";
                    descricao = "JOB [assinaturasExpiradas()] foi finalizado " + dataFimPR + ". Total de " + length + " registro(s) processado(s) com sucesso."
                    sendAdminMail(null, titulo, descricao, null, null);
                }
            });
        }, schedule);
    }

    function  avisoAssinaturaExperidas(){
        var schedule = later.parse.cron('0 0/1 * 1/1 * ? *', true);
        var action = later.setInterval(function(){
            console.log("Aviso de assinaturas Expiridas : " + new Date());
        }, schedule);
    }

    /**
     * Essa function tem o objetivo de enviar um email informativo alertando
     * que sua assinatura já venceu.
     * 
     * @param  {[String]} email      email do cliente que será notificado.
     * @param  {[Object} assinatura  Objeto assinatura.
     */
    function sendEmailAssinaturaExperida(email, assinatura){
        var host = "www.junkstation.com.br";
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

    function sendAdminMail(email, titulo, descricao, link, descricao_link){
        var _email = email || "edleson.duarte@gmail.com";
        
        var destination = {
            email : _email ,
            data  : {
                titulo : titulo || "E-mail Administração Junkstation/Meu Velinho", 
                descricao : descricao || "Esse é um email administrativo do site Junkstation/Meu Velinho, essa é mensagem default",
                link : link || "#",
                descricao_link : descricao_link || " "
            }
        };

        emailSender.sendAdminMail(destination, function(error , info){
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
