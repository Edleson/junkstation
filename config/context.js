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

    /*console.log("Carregando o contexto da aplicação ......");
    console.log("USER_EMAIL = [ "+ USER_EMAIL +" ]");
    console.log("USER_EMAIL_PASS = [ "+ USER_EMAIL_PASS +" ]");
    console.log("AWS_ACCESS_KEY = [ "+ AWS_ACCESS_KEY +" ]");
    console.log("AWS_SECRET_KEY = [ "+ AWS_SECRET_KEY +" ]");
    console.log("SEC_SALT = [ "+ SEC_SALT +" ]");
    console.log("MONGODB_URL = [ "+ MONGODB_URL +" ]");
    console.log("NODE_SSL_CERT = [ "+ NODE_SSL_CERT +" ]");
    console.log("NODE_SSL_KEY = [ "+ NODE_SSL_KEY +" ]");*/

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
            secret_key : AWS_SECRET_KEY
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
        }
    };

    //console.log(context);

    return context;
}