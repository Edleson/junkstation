var mongoose   = require('mongoose');
module.exports = function(app) {
    var schema = mongoose.Schema({
        titulo : {  
            type     : String , 
            required : true   
        },

        descricao : {  
            type     : String , 
            required : true   
        },

        imagem : {  
            type     : String , 
            required : false   
        },

        situacao : {  
            type    : Boolean , 
            default : true 
        },
        
        dataCricao : {
          type    : Date , 
          default : Date.now 
        }

    }, {collection: 'servico'});
    
    return mongoose.model('Servico', schema);
};
