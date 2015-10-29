var mongoose   = require('mongoose');

module.exports = function(app) {
    var Utils       = app.util.utils;
    
    var schema = mongoose.Schema({
        user : {
            type : mongoose.Schema.ObjectId ,
            required : true , 
            index : true
        }, 

        plano : {
            type : mongoose.Schema.ObjectId
        },

        anunciante : {
            type : String ,
            required : true 
        },

        localizacao : {
            type : String ,
            index : true
        },

        estado : {
            type : String
        },

        data_anuncio : {
            type : Date ,
            required : true 
        },

        data_vencimento : {
            type : Date ,
            required : true 
        },

        status : {
            type : Boolean ,
            default : true 
        },

        preco : {
            type     : Number ,
            default  : 0.0 
        },

        kilometragem : {
            type : String
        },

        marca : {
            type : String
        },

        modelo : {
            type : String
        },

        ano : {
            type : Number 
        },

        numero_portas : {
            type : Number 
        },

        cambio : {
            type : String
        },

        cor : {
            type : String
        },

        categoria : {
            type : String
        },

        combustivel : {
            type : String
        },

        estilo : {
            type : String
        },

        motor : {
            type : String
        },

        renavam : {
            type : Number 
        },

        placa : {
            type : String
        },

        titulo_anuncio : {
            type : String
        },

        descricao_anuncio : {
            type : String
        },

        fotos : {
            type : String
        },

        videos : {
            type : String
        }
         
    }, {collection: 'anuncio'});

    schema.methods = {
        findByQuery : function(cb, query){
            return this.model("Anuncio").find(query, cb);
        }
    };

    schema.virtual('precoFormatado').get(function(){
        if(this.preco !== undefined){
            return Utils.numeral().format(this.preco);
        }else{
            return '0,00';
        }
    });
    
    return mongoose.model('Anuncio', schema);
};
