var passport         = require('passport');
var mongoose         = require('mongoose');
var LocalStrategy    = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
//var GoogleStrategy   = require('passport-google-oauth').OAuth2Strategy;
//var configAuth       = require('./auth');
var context         = require("../config/context")();
var emailSender     = require("./emailHandler")(context);
var security        = require("./securityHandler")(context);

module.exports = function() {
	var User = mongoose.model('User');
    var Repository = new User({});
	
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id).populate("plano").exec(function(err, user) {
            //console.log("deserializeUser : \n" + user);
            done(err, user);
        });
    });

	/********************************************************************************************
	 * Estratégia para login local, utilizando usuário e senha mongodb                          *
	 ********************************************************************************************/
    passport.use('local-login', new LocalStrategy({
        usernameField     : 'email'    ,
        passwordField     : 'password' ,
        passReqToCallback : true 
    }, function(req, email, password, done) {
        
        process.nextTick(function() {
            User.findOne({ 'local.email' :  email }).populate("plano").exec(function(err, user) {
                if (err){
					return done(err);
				}
                 
                if (!user){
					return done(null, false, req.flash('loginInvalido', '<div class="alert-error">Não conseguimos localizar nenhum usuário cadastrado com esse e-mail!</div>'));
				}

                if(!user.contaAtiva){
                    return done(null, false, req.flash('loginInvalido', '<div class="alert-error">Para realizar o login você precisa ativar o seu cadastro</div>'));   
                }
                    
                if (!user.validPassword(password)){
					return done(null, false, req.flash('loginInvalido', '<div class="alert-error">Oops! :( senha incorreta!</div>'));
				}else{
					return done(null, user);
				}
            });
        });
    }));

	/********************************************************************************************
	 * Está funcão é responsável em persistir um novo usuário na base de dados.                 *
	 ********************************************************************************************/
    passport.use('local-signup', new LocalStrategy({
        usernameField     : 'email'    ,
        passwordField     : 'password' ,
        passReqToCallback : true 
    }, function(req, email, password, done) {
        var host = req.headers.host;
        var url  = "/login/confirmacao/";
        var link = "https://" + host + url; 
        process.nextTick(function() {
            User.findOne({'local.email': email}, function(err, existingUser) {
                if (err){
					return done(err);
				}
 
                if (existingUser){
					return done(null, false, req.flash('cadastroInvalido', '<div class="alert-error">Desculpe já encontramos seu e-mail na nossa base de dados :(</div>'));
				} 
                    
                if(req.user) {
                    var user                  = req.user;
                    user.local.username       = req.body.username ;
                    user.local.email          = email;
                    user.local.password       = user.generateHash(password);
                    user.save(function(err) {
                        if (err){
							throw err;
						}   
                        return done(null, user);
                    });
                }else {
                    var newUser               = new User();
                    newUser.local.username    = req.body.username ;
                    newUser.local.email       = email;
                    newUser.local.password    = newUser.generateHash(password);
                    newUser.save(function(err, user) {
                        if (err){
							throw err;
						}
                        /*******************************************************
                         * Envia um e-mail de boas vindas para quando o temos  * 
                         *um novo cadastro.                                    *
                         *******************************************************/
                        var uri  = security.cryptHexNumber(user._id);
                        var destination = {
                            email : newUser.local.email ,
                            data  : {
                                username : newUser.local.username , 
                                link     : link + uri
                            }
                        };

                        emailSender.sendWelcomeMail(destination, function(error , info){
                            if(error){
                                console.log(error);
                                newUser.remove({"_id" : user._id}, function(err){
                                    console.log(err);
                                });
                                return done(error);
                            }else{
                                return done(null, false, req.flash('cadastroInvalido', '<div class="alert-success">Seu cadastro foi realizado com sucesso, enviamos um email para ativar sua conta.</div>'));
                            }
                        });

                       // return done(null, newUser);
                    });
                }
            });
        });
    }));
    
    return passport;
};