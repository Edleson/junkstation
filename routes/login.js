var passport = require('../middlewares/passportHandler')();

module.exports = function(app) {
    var security = app.get("security");
    var isLoggedIn = require('./../middlewares/loginHandler');
    var controller = app.controllers.public.loginController;

    app.get('/login', security.forceHTTPS, function(req, res, next) {
        res.render('login');
    });

    app.get('/login/confirmacao/:id', security.forceHTTPS, controller.confirmaCadastro);

    app.get('/profile', isLoggedIn, security.forceHTTPS, function(req, res) {
        res.render('./profile/profile', {});
    });

    app.post('/login', security.forceHTTPS, passport.authenticate('local-login', {
        successRedirect: '/anuncio/meusanuncios',
        failureRedirect: '/login',
        failureFlash: true
    }));

    app.post('/login/novo', security.forceHTTPS, passport.authenticate('local-signup', {
        successRedirect: '/anuncio/meusanuncios',
        failureRedirect: '/login',
        failureFlash: true
    }));

    app.post('/login/recuperarsenha', security.forceHTTPS, controller.recuperarSenha);

    app.get('/login/alterarsenha/:id', security.forceHTTPS, function(req, res, next) {
        var id = security.decryptHexNumber(req.params.id);
        res.render('alterar-senha', { user_id: id });
    });

    app.get('/login/novasenha/:id', isLoggedIn, security.forceHTTPS, function(req, res, next) {
        var id = security.decryptHexNumber(req.params.id);
        res.render('alterar-senha-logado', { user_id: id });
    });

    app.post('/login/alterarsenha', security.forceHTTPS, controller.alterarSenha);

    app.post('/login/novasenha', isLoggedIn, security.forceHTTPS, controller.novasenha);
};