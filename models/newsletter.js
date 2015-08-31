var mongoose = require('mongoose');

module.exports = function() {
    
    var schema = mongoose.Schema({
        nome : {  
            type     : String , 
            required : true   
        },

        email : {  
            type     : String , 
            required : true   ,
            index    : {
                unique : true
            }
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
