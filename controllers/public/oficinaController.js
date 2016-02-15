module.exports = function(app) {
    var context        = app.get("context");
    var Utils          = app.util.utils;
    var htmlMinify     = app.get("html-minify");
    var controller     = {};
    

    controller.index = function(req, res, next) {
        htmlMinify('oficina', res , {});
    }

    return controller; 
};   