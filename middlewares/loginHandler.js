module.exports = function(req, res, next) {
	if (req.isAuthenticated()){
		return next();
	}
    res.redirect('https://' + req.headers.host + "/login");
};