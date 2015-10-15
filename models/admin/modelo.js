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

    schema.methods = {
        findByQuery : function(cb, query){
            return this.model("Modelo").find(query, cb);
        }
    };

    
    return mongoose.model('Modelo', schema);
};
