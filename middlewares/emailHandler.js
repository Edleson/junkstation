var nodemailer    = require('nodemailer');
var path          = require('path');
var templatesDir  = path.resolve(__dirname, '..', 'views/template/email');
var EmailTemplate = require("email-templates").EmailTemplate;
var config        = require("../config");

module.exports = function(ctx) {
	var email   = {};

	var emailOptions = {
		host : ctx.email.hostname ,
		port : ctx.email.port     ,
		auth: {
		    user: ctx.email.auth.user ,
		    pass: ctx.email.auth.pass
		}
	};
	
	var transporter = nodemailer.createTransport(emailOptions);

	email.sendWelcomeMail = function(data, callback){
		var template = new EmailTemplate(path.join(templatesDir, 'welcome'));

		template.render(data, function(error, results){
			if(error){
				console.error(error);
			}

			transporter.sendMail({
	    		from    : "no-replay@junkstation.com.br"     ,
	    		to      : data.email                         ,
	    		subject : 'Bem vindo à família Junkstation'  ,
	    		html    : results.html                       ,
	    		text    : results.text     
			}, callback);
		});	
	}

	email.sendNewPassword = function(data, callback){
		var template = new EmailTemplate(path.join(templatesDir, 'nova-senha'));
		
		template.render(data, function(error, results){
			if(error){
				console.error(error);
			}

			transporter.sendMail({
	    		from    : "no-replay@junkstation.com.br"     ,
	    		to      : data.email                         ,
	    		subject : 'Solicitação de nova senha'  		 ,
	    		html    : results.html                       ,
	    		text    : results.text     
			}, callback);
		});	
	}

	email.sendNewsletter = function(data, callback){
		var template = new EmailTemplate(path.join(templatesDir, 'newsletter'));
		
		template.render(data, function(error, results){
			if(error){
				console.error(error);
			}

			transporter.sendMail({
	    		from    : "no-replay@junkstation.com.br"     ,
	    		to      : data.email                         ,
	    		subject : 'Newsletter Junk Station'  		 ,
	    		html    : results.html                       ,
	    		text    : results.text     
			}, callback);
		});	
	}

	email.sendNewAnuncio = function(data, callback){
		var template = new EmailTemplate(path.join(templatesDir, 'novo-anuncio'));
		
		template.render(data, function(error, results){
			if(error){
				console.error(error);
			}

			transporter.sendMail({
	    		from    : "no-replay@junkstation.com.br"     		,
	    		to      : data.email                         		,
	    		subject : 'Obrigado por anunciar na Junk Station'   ,
	    		html    : results.html                       		,
	    		text    : results.text     
			}, callback);
		});	
	}

	return email;
}