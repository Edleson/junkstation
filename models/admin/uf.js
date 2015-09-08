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
    
    return mongoose.model('UF', schema);
};
