var mongoose     = require('mongoose');
var bcrypt       = require('bcrypt-nodejs');
var findOrCreate = require('mongoose-findorcreate');

module.exports = function() {
    var userSchema = mongoose.Schema({
        local            : {
            username     : String ,
            email        : String ,
            password     : String 
        },

        facebook         : {
            id           : String ,
            token        : String ,
            email        : String ,
            name         : String
        },

        twitter          : {
            id           : String ,
            token        : String ,
            displayName  : String ,
            username     : String 
        },

        google           : {
            id           : String ,
            token        : String ,
            email        : String ,
            name         : String
        },

        dataCadastro : {
            type    : Date      , 
            default : Date.now  
        },

        status : {
            type    : Boolean   , 
            default : true 
        },

        contaAtiva : {
            type    : Boolean   ,
            default : false
        },

        newsletter : {
            type    : Boolean   , 
            default : false 
        },

        emailEnviado : {
            type    : Boolean   , 
            default : false 
        },

        perfil  : {
            type : Array        ,
            default : ["ANUNCIANTE"]
        }

    }, {collection: 'user'});

    userSchema.methods.findByQuery = function(cb, query){
        return this.model("User").find(query, cb);
    };
  
    userSchema.methods.generateHash = function(password) {
      return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
    };
    
    userSchema.methods.validPassword = function(password) {
      return bcrypt.compareSync(password, this.local.password);
    };

    userSchema.methods.changePassword = function(password, newPassword) {
       if(bcrypt.compareSync(password, this.local.password)){
          this.model("User").save({"local.email" : this.local.email}, function(error, user){
            if(error){
              console.error(error);
              throw new Error("Erro ao atualizar a senha do usuário");
            }
          });
       }else{
          throw new Error("Senha anterior inválida :( !");
       }
    };  
    
    userSchema.plugin(findOrCreate);
    
    return mongoose.model('User', userSchema);
};
