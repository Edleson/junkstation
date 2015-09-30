var mongoose   = require('mongoose');
module.exports = function(app) {
    var schema = mongoose.Schema({
        titulo : {  
            type     : String , 
            required : true   
        },

        tipoPessoa : {
            type     : String , 
            required : true  
        },

        sigla : {  
            type     : String 
        },

        qtdFotos : {
            type     : Number ,
            default  : 1 
        },

        qtdVideos : {
            type     : Number ,
            default  : 0 
        },

        prioridade : {
            type     : Number ,
            default  : 0 
        },

        expiracao : {
            type     : Number ,
            default  : 30 
        },

        descExpiracao : {  
            type     : String , 
            required : true   
        },

        descricao : {  
            type     : String    
        },

        situacao : {  
            type    : Boolean , 
            default : true 
        },

        destaque : {  
            type    : Boolean , 
            default : false 
        },
        
        dataCricao : {
          type    : Date , 
          default : Date.now 
        },

        preco : {
            type     : Number ,
            default  : 0.0 
        }

    }, {collection: 'plano'});
    
    return mongoose.model('Plano', schema);
};
