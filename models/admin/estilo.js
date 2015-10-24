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
        
        dataCricao : {
          type    : Date , 
          default : Date.now 
        }
                   
    }, {collection: 'estilo'});

    schema.methods = {
        findByQuery : function(cb, query){
            return this.model("Estilo").find(query, cb);
        }
    };
    
    return mongoose.model('Estilo', schema);
};
