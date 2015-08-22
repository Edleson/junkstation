var express 	= require('express');
var router 		= express.Router();


router.get('/list', function(req, res, next) {
  res.render('anuncio_lista');
});

router.get('/grid', function(req, res, next) {
  res.render('anuncio_grid');
});

router.get('/detail', function(req, res, next) {
  res.render('anuncio_detalhe');
});

router.get('/creat', function(req, res, next) {
  res.render('criar_anuncio');
});

router.get('/meusanuncios', function(req, res, next) {
  res.render('meus_anuncios');
});

module.exports = router;
