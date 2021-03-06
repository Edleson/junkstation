var mongoose     = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');

module.exports = function(app) {
    var schema = mongoose.Schema({
        nome : {  
            type     : String , 
            required : true   
        },

        email : {  
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

    }, {collection: 'newsletter'});

    schema.methods = {
        findByQuery : function(cb, query){
            return this.model("Newsletter").find(query, cb);
        }
    };

    schema.plugin(findOrCreate);
    
    return mongoose.model('Newsletter', schema);
};
