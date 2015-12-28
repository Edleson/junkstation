var mongoose         = require('mongoose');
var deepPopulate     = require('mongoose-deep-populate')(mongoose);
var mongoosePaginate = require('mongoose-paginate');
 
module.exports = function(app) {

    var media = {
        prefix  : { type : String, default : "/dist/images/"} ,
        nome    : { type : String, default : "no-image.png"}  ,
        tipo    : { type : String, default : "image/png"}     ,
        tamanho : { type : Number}
    };

    var proposta = {
        //id           : { type : mongoose.Schema.ObjectId },
        nomeContato  : { type : String },
        emailContato : { type : String },
        assunto      : { type : String },
        dataProposta : { type : Date , default : Date.now },
        resposta     : {
            data   : { type : Date   },
            corpo  : { type : String },
            status : { type : Boolean , default : false}
        } 
    };
 
    var schema = mongoose.Schema({ 
        user : { 
            type : mongoose.Schema.ObjectId  ,
            required : true                  , 
            index    : true                  ,
            ref      : 'User'                
        }, 

        plano : {
            type : mongoose.Schema.ObjectId  ,
            required : true                  , 
            index    : true                  ,
            ref      : 'Plano'     
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
            type     : Date ,
            required : true , 
            index    : true 
        },

        data_vencimento : {
            type     : Date  ,
            required : true  ,
            index    : true 
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
            type  : String , 
            index : true
        },

        modelo : {
            type  : String , 
            index : true 
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
            type : String ,
            index : true
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

        fotoPrincipal : media ,

        demaisFotos : [media] ,

        videos : {
            type : String
        },

        views : {
            type    : Number ,
            default : 0
        },

        relevancia : {
            type    : Number ,
            default : 0
        },  

        proposta : [proposta]
         
    }, {collection: 'anuncio'});

    schema.methods = {
        findByQuery : function(cb, query){
            return this.model("Anuncio").find(query, cb);
        }
    };

    schema.plugin(deepPopulate, {
        whitelist: [
            'user' ,
            'plano'
        ]
    });

    schema.plugin(mongoosePaginate);
    
    return mongoose.model('Anuncio', schema);
};
