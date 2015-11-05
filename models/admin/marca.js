var mongoose   = require('mongoose');
var deepPopulate = require('mongoose-deep-populate')(mongoose);

module.exports = function(app) {
    var schema = mongoose.Schema({
        nome : {  
            type     : String , 
            required : true   , 
            index    : true
        },

        categoria : { 
            type     : mongoose.Schema.Types.ObjectId   , 
            ref      : 'Categoria'                      ,
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
                   
    }, {collection: 'marca'});

    
    schema.methods = {
        findByQuery : function(cb, query){
            return this.model("Marca").find(query, cb);
        }
    };

    schema.plugin(deepPopulate, {
        whitelist: [
            'categoria'
        ]
    });
    
    return  mongoose.model('Marca', schema);
};
