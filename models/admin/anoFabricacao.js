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
    
    return mongoose.model('AnoFabricacao', schema);
};
