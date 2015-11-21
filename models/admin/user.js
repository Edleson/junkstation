var mongoose     = require('mongoose');
var bcrypt       = require('bcrypt-nodejs');
var findOrCreate = require('mongoose-findorcreate');
var moment       = require('moment');
var deepPopulate = require('mongoose-deep-populate')(mongoose);

module.exports = function() {
    var media = {
        prefix  : {
            type   : String,
            default : "/dist/images/" 
        },
        nome    : {
            type : String,
            default : "no-image.png"

        },
        tipo    : {
            type : String ,
            default : "image/png"
        },
        tamanho : {type : Number}
    };

    var userSchema = mongoose.Schema({
        local : {
            username     : String ,
            email        : {
                type : String    ,
                index : {
                    unique : true
                }
            } ,
            password     : String 
        },

        facebook : {
            id           : String ,
            token        : String ,
            email        : String ,
            name         : String
        },

        twitter : {
            id           : String ,
            token        : String ,
            displayName  : String ,
            username     : String 
        },

        google : {
            id           : String ,
            token        : String ,
            email        : String ,
            name         : String
        },

        fotoPerfil : media , 

        plano : {
            type     : mongoose.Schema.Types.ObjectId   , 
            ref      : 'Plano'                           
        },

        dataCadastro : {
            type    : Date      , 
            default : Date.now  
        },

        ultimoLogin : {
            type    : Date       , 
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
        },

        dadosPessoais : {
            tipopessoa : {
                type : String  ,
                trim : true    
            },

            razaosocial : {
                type : String  ,
                trim : true    
            },

            cnpj : {
                type   : String ,
                index  : true
            },

            nome : {
                type  : String  ,
                trim  : true    ,
                index : true 
            },

            dataNascimento : {
                type : Date  ,
            },

            cpf : {
                type   : String ,
                index  : true
            },

            sexo : {
                type : String  ,
                trim : true    
            },

            cep : {
                type : String 
            },

            logradouro : {
                type : String  ,
                trim : true    
            },

            numeroLogradouro : {
                type : String  ,
                trim : true    
            },

            bairro : {
                type : String  ,
                trim : true    
            },

            complemento : {
                type : String  ,
                trim : true    
            },

            cidade : {
                type : String  ,
                trim : true    
            },

            estado : {
                type : String  ,
                trim : true    
            },

            celular : {
                type : String  ,
                trim : true    
            },

            telefone : {
                type : String  ,
                trim : true    
            }
        }

    }, {collection: 'user'});

    userSchema.virtual('dadosPessoais.dataNascimentoFormatada').get(function(){
        if(this.dadosPessoais.dataNascimento !== undefined){
            return moment(this.dadosPessoais.dataNascimento).format('DD/MM/YYYY');
        }else{
            return '';
        }
    });

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

    userSchema.plugin(deepPopulate, {
        whitelist: [
            'plano'
        ]
    });  
    
    userSchema.plugin(findOrCreate);

    var User = mongoose.model('User', userSchema);

    createMasterUser(User);
    
    return User;
};

function createMasterUser(User){
    var email = "master@junkstation.com.br";
    var password = "junk1234";
    var _user = User({}); 
    
    _user.local = {
        username  : "Master" ,
        email     : email    ,
        password  : _user.generateHash(password)
    };

    _user.emailEnviado = true ;
    _user.status       = true ;
    _user.contaAtiva   = true ;
    _user.perfil.push("ADMIN");

    User.findOne({ 'local.email' :  email }, function(error, existingUser){
        if(error){
            console.log("Ocorreu um erro ao pesquisar o usuário master : " + error);
        }

        if (!existingUser){
            _user.save(function(_err, newUser){
                if(_err){
                    console.log("Ocorreu um erro ao pesquisar o usuário master : " + _err);
                }
                console.log("Usuário master cadastrado com sucesso");
            });
        }
    });
}
