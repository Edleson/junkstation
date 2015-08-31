var mongoose = require('mongoose');

module.exports = function() {
    
    var schema = mongoose.Schema({
        nome : {  
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

        marca : { 
            type     : Schema.Types.ObjectId , 
            ref      : 'Marca'               ,
            required : true    
        },
        
        dataCricao : {
          type    : Date , 
          default : Date.now 
        }           
    });
    
    return mongoose.model('Modelo', schema);
};
