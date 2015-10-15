var mongoose   = require('mongoose');
module.exports = function(app) {
    var schema = mongoose.Schema({
        nome : {  
            type     : String , 
            required : true   
        },

        situacao : {  
            type    : Boolean , 
            default : true 
        },
        
        dataCricao : {
          type    : Date , 
          default : Date.now 
        }

    }, {collection: 'uf'});

    schema.methods = {
        findByQuery : function(cb, query){
            return this.model("UF").find(query, cb);
        }
    };
    
    return mongoose.model('UF', schema);
};
