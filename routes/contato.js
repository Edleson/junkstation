module.exports = function(app) {
	var security    = app.get("security");
	
  	app.get('/contato', security.forceHTTP, function(req, res, next){
  		res.render('contato');
  	});
};
