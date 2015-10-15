module.exports = function(app) {
  	var security   = app.get("security");
  	
  	app.get('/servico', security.forceHTTP, function(req, res, next){
  		res.render('servico');
  	});
};
