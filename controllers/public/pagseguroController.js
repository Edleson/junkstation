module.exports = function(app) {
    var htmlMinify        = app.get("html-minify");
    //var categoria         = new app.models.admin.categoria({});
    var controller     = {};
    var responseObject = {}; 

    controller.index = function(req, res, next) {
        console.log(req.query);
        console.log(req.body);
        htmlMinify('pagseguro_success', res , {});
    }

    controller.success = function(req, res, next) {
        console.log(req.query);
        console.log(req.body);
        htmlMinify('pagseguro_success', res , {});
    }

    return controller; 
};  