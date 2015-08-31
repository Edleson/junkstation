var mongoose = require('mongoose');

module.exports = function() {
    
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

        ativo : {  
            type    : Boolean , 
            default : true 
        },
        
        dataCricao : {
          type    : Date , 
          default : Date.now 
        }           
    });
    
    return mongoose.model('Servico', schema);
};
