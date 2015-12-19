module.exports = function(app) {
	var security    = app.get("security");
	var controller  = app.controllers.public.indexController;
  	
  	app.get('/' , security.forceHTTP, controller.index);
  	app.get('/google943d715b7f0e63b1.html' , security.forceHTTP, function(req, res, next){
  		res.render("google943d715b7f0e63b1");
  	});
};
