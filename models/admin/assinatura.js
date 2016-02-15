var mongoose     = require('mongoose');
var deepPopulate = require('mongoose-deep-populate')(mongoose);
var findOrCreate = require('mongoose-findorcreate');


 
module.exports = function(app) {
    var historicoTransacao = {
        descricaoEvento  : {type : String},
        dataEvento       : {type : Date ,  default : Date.now},
        tipoEvento       : {type : String}
    };

    var schema = mongoose.Schema({
        user : { 
            type     : mongoose.Schema.Types.ObjectId   , 
            ref      : 'User'                           ,
            required : true    
        },

        plano : { 
            type     : mongoose.Schema.Types.ObjectId   , 
            ref      : 'Plano'                          ,
            required : true    
        },

        nome_assinatura : {  
            type     : String , 
            required : false    
        },

        nome_plano : {  
            type     : String , 
            required : true    
        },

        valor_pago : {  
            type     : Number , 
            required : true    
        },

        operadora_cobranca : {  
            type     : String , 
            required : true    
        },

        inicio_vigencia : {  
            type     : Date , 
            required : true    
        },

        fim_vigencia : {  
            type     : Date , 
            required : true    
        },

        id_transacao : {  
            type     : String     
        },

        status : {  
            type     : Number , 
            required : true    
        },

        renovacao_automatica : {
            type    : Boolean   ,
            default : false
        },

        observacao : {  
            type     : String     
        },

        vencido : {
            type    : Boolean   ,
            default : false
        },

        url_pagamento : {
            type : String
        },

        historico : [historicoTransacao],

        qtdAnuncio : {  
            type     : Number , 
            required : true   ,
            default  : 0 
        },

    }, {collection: 'assinatura'});

    schema.methods = {
        findByQuery : function(cb, query){
            return this.model("Assinatura").find(query, cb);
        }
    };

    schema.plugin(findOrCreate);

    schema.plugin(deepPopulate, {
        whitelist: [
            'plano',
            'user' 
        ]
    });
    
    return mongoose.model('Assinatura', schema);
};
