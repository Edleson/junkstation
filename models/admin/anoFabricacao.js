var mongoose   = require('mongoose');

module.exports = function(app) {
    var schema = mongoose.Schema({
        ano : {  
            type     : Number , 
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
    }, {collection: 'anoFabricacao'});

    schema.methods = {
        findByQuery : function(cb, query){
            return this.model("AnoFabricacao").find(query, cb);
        }
    };
    
    return mongoose.model('AnoFabricacao', schema);
};
