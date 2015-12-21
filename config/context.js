module.exports = function(){
    var USER_EMAIL      = process.env.USER_EMAIL                                         ;
    var USER_EMAIL_PASS = process.env.USER_EMAIL_PASS                                    ;
    var AWS_ACCESS_KEY  = process.env.AWS_ACCESS_KEY                                     ;
    var AWS_SECRET_KEY  = process.env.AWS_SECRET_KEY                                     ;
    var SEC_SALT        = process.env.SEC_SALT                                           ;
    var MONGODB_URL     = process.env.MONGODB_URL                                        ;
    var NODE_SSL_CERT   = process.env.NODE_SSL_CERT                                      ;
    var NODE_SSL_KEY    = process.env.NODE_SSL_KEY                                       ;
    var SEC_HASH        = "0123456789abcdefghijlmnopqrstuvxzywABCDEFGHIJLMNOPQRSTUVXZYW" ;

    var PAGSEGURO_ENV   = process.env.PAGSEGURO_ENV                                      ;
    var PAGSEGURO_EMAIL = process.env.PAGSEGURO_EMAIL                                    ;
    var PAGSEGURO_TOKEN = process.env.PAGSEGURO_TOKEN                                    ;

    /*console.log("Carregando as variáveis de ambiente ............");
    console.log("USER_EMAIL = [ "+ USER_EMAIL +" ]");
    console.log("USER_EMAIL_PASS = [ "+ USER_EMAIL_PASS +" ]");
    console.log("AWS_ACCESS_KEY = [ "+ AWS_ACCESS_KEY +" ]");
    console.log("AWS_SECRET_KEY = [ "+ AWS_SECRET_KEY +" ]");
    console.log("SEC_SALT = [ "+ SEC_SALT +" ]");
    console.log("MONGODB_URL = [ "+ MONGODB_URL +" ]");
    console.log("NODE_SSL_CERT = [ "+ NODE_SSL_CERT +" ]");
    console.log("NODE_SSL_KEY = [ "+ NODE_SSL_KEY +" ]");
    console.log("PAGSEGURO_ENV = [ "+ PAGSEGURO_ENV +" ]");
    console.log("PAGSEGURO_EMAIL = [ "+ PAGSEGURO_EMAIL +" ]");
    console.log("PAGSEGURO_TOKEN = [ "+ PAGSEGURO_TOKEN +" ]");*/

    var context = {
        email : {
            hostname     : "junkstation.com.br"             ,
            port         : 587                              ,
            default_from : "no-replay@junkstation.com.br"   ,
            auth : {
                user : USER_EMAIL       ,
                pass : USER_EMAIL_PASS
            }
        },

        aws : {
            access_key : AWS_ACCESS_KEY ,
            secret_key : AWS_SECRET_KEY ,
            S3 : {
                Bucket          : "junkstation"                ,
                ACL             : "public-read"                ,
                CacheControl    : "max-age=" + (86400000 * 30) ,//30 Dias
                ContentLanguage : "pt-BR"                      ,
                Expires         : (86400000 * 30)               //30 Dias
            }
        },

        sec : {
            salt            : SEC_SALT      ,  
            hash            : SEC_HASH      ,
            length          : 512           ,
            ssl_cert        : NODE_SSL_CERT ,
            ssl_key         : NODE_SSL_KEY     
        },

        session : {
            secret : "junkstation"      , 
            key    : "junkstation.sid"  ,
            maxAge : 3600000
        }, 

        database :{
            url : MONGODB_URL
        },

        //LocalStorage , S3Storage
        storage : {
            storageType : "LocalStorage",
            localStorage : {
                prefix : "/tmp/"         ,
                nome    : "LocalStorage"
            },
            s3Storage : {
                prefix : "",
                nome    : "S3Storage"
            }
        },

        cobranca : {
            pagseguro : {
                email            : PAGSEGURO_EMAIL                                      ,
                token            : PAGSEGURO_TOKEN                                      , 
                ambiente         : PAGSEGURO_ENV || "sandbox"                           ,
                comprador        : "c75900997936019031965@sandbox.pagseguro.com.br"     ,
                
                buildUrlCheckout : function(code){
                    var baseUrlProduction = "https://pagseguro.uol.com.br/v2/checkout/payment.html?code=";
                    var baseUrlSandbox    = "https://sandbox.pagseguro.uol.com.br/v2/checkout/payment.html?code="
                    if(this.ambiente === "sandbox"){
                        return baseUrlSandbox + code;
                    }else{
                        return baseUrlProduction + code;
                    }
                },

                getRedirectUrl : function(){
                    if(this.ambiente === "sandbox"){
                        return "https://www.pontoclass.com/pagseguro/success";
                    }else{
                        return "https://www.junkstation.com.br/pagseguro/success";
                    }
                },

                getNotificationUrl : function(){
                    if(this.ambiente === "sandbox"){
                        return "https://www.pontoclass.com/pagseguro/notificacao";
                    }else{
                        return "https://www.junkstation.com.br/pagseguro/notificacao";
                    }
                },

                getUrlSearchTransaction : function(transaction_id){
                    if(this.ambiente === "sandbox"){
                        return "https://ws.sandbox.pagseguro.uol.com.br/v3/transactions/notifications/" + transaction_id + "?email=" + this.email +"&token="+this.token;
                    }else{
                        return "https://ws.pagseguro.uol.com.br/v3/transactions/notifications" + transaction_id + "?email=" + this.email +"&token="+this.token;;
                    }
                }
            }
        },

        watermark : true
    };

    return context;
}