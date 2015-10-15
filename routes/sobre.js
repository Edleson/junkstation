module.exports = function(app) {
  	var security   = app.get("security");
  	
  	app.get('/sobre', security.forceHTTP, function(req, res, next){
  		res.render('sobre');
  	});
};
