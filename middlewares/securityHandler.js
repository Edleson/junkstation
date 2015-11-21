var forceSSL    = require('express-force-ssl');
var Hashids     = require("hashids");

module.exports = function(context) {
	var handler = {};

	handler.forceHTTP = function(req, res, next){
		var schema = req.headers['x-forwarded-proto'];
		if (schema === 'http') {
    		next();
  		}else {
    		res.redirect('http://' + req.headers.host + req.url);
  		}
	};

	handler.forceHTTPS     = forceSSL;

	handler.forceHTTPSAjax = forceSSL;

	handler.cryptNumber  = function(value){
		hashids = new Hashids(context.sec.salt , context.sec.length , context.sec.hash);
		return hashids.encode(value);
	};

	handler.decryptNumber  = function(value){
		hashids = new Hashids(context.sec.salt , context.sec.length , context.sec.hash);
		return hashids.decode(value);
	};

	handler.cryptHexNumber  = function(value){
		hashids = new Hashids(context.sec.salt , context.sec.length , context.sec.hash);
		return hashids.encodeHex(value);
	};

	handler.decryptHexNumber  = function(value){
		hashids = new Hashids(context.sec.salt , context.sec.length , context.sec.hash);
		return hashids.decodeHex(value);
	};

	handler.authorize  = function(req, res, next){
		var user = req.user;

		if(!user){
			next(new Error("Você não tem autorização para acessar essa funcionalidade!"));
		}

		var perfil = user.perfil.filter(function(item){
			return item === "ADMIN";
		});

		if(!perfil || perfil.length == 0){
			return next(new Error("Seu perfil não tem acesso a essa funcionalidade!"));
		}else{
			return next();
		}
	};

	return handler;
};