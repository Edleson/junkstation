var mongoose   = require('mongoose');
module.exports = function(app) {
    var schema = mongoose.Schema({
        nome : {  
            type     : String , 
            required : true   , 
            index    : { 
                unique : true
            } 
        },

        situacao : {  
            type    : Boolean , 
            default : true 
        },

        marca : { 
            type     : mongoose.Schema.Types.ObjectId   , 
            ref      : 'Marca'                          ,
            required : true    
        },
        
        dataCricao : {
          type    : Date , 
          default : Date.now 
        }

    }, {collection: 'modelo'});
    
    return mongoose.model('Modelo', schema);
};
