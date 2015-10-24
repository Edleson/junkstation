var mongoose   = require('mongoose');
module.exports = function(app) {
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

        situacao : {  
            type    : Boolean , 
            default : true 
        },
        
        dataCricao : {
          type    : Date , 
          default : Date.now 
        }

    }, {collection: 'servico'});

    schema.methods = {
        findByQuery : function(cb, query){
            return this.model("Servico").find(query, cb);
        }
    };
    
    return mongoose.model('Servico', schema);
};
