var mongoose     = require('mongoose');
var deepPopulate = require('mongoose-deep-populate')(mongoose);

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

    schema.plugin(deepPopulate, {
        whitelist: [
            'marca',
            'marca.categoria'
        ]
    });
    
    return mongoose.model('Modelo', schema);
};
