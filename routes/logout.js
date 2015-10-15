module.exports = function(app) {
  	var security   = app.get("security");
  	
  	app.get('/logout', function(req, res, next){
  		req.logout();
  		res.redirect("/");
  	});
};