var express 	= require('express');
var router 		= express.Router();

router.get('/', function(req, res, next) {
  res.render('login');
});

router.post('/', function(req, res, next) {
	//req.session.clear();
  	var user = {};
 	user.email    = req.body.email;
  	user.password = req.body.password;
  	req.session.user = user;
  	res.redirect("/");
});

module.exports = router;
