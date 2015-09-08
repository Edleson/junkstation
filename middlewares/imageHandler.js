var Imagemin        = require('imagemin');

module.exports = function(){
    /************************************************************
     * Essa módulo é responsável por tratas as imagens que estão *
     *localizadas na pasta public/images e geram novas imagens   *
     *otimizadas para web                                        *
     ***********************************************************/
    var imagezip = new Imagemin();
    imagezip.src('public/real_images/*.{gif,jpg,png,svg}')
        .dest('public/dist/images')
        .use(Imagemin.jpegtran({progressive: true}))
        .use(Imagemin.gifsicle({interlaced: true}))
        .use(Imagemin.optipng({optimizationLevel: 3}))
        .use(Imagemin.svgo())
        .run(function (err, files) {
            if(err){
              //console.log("Ocorreu um erro durante a geração das imagens otimizadas." , err);
            }
        });

    var imagezip2 = new Imagemin();
    imagezip2.src('public/real_images/fancybox/*.{gif,jpg,png,svg}')
        .dest('public/dist/images/fancybox')
        .use(Imagemin.jpegtran({progressive: true}))
        .use(Imagemin.gifsicle({interlaced: true}))
        .use(Imagemin.optipng({optimizationLevel: 3}))
        .use(Imagemin.svgo())
        .run(function (err, files) {
            if(err){
             // console.log("Ocorreu um erro durante a geração das imagens otimizadas." , err);
            }
        });

    var imagezip3 = new Imagemin();
    imagezip3.src('public/real_images/junkcars/*.{gif,jpg,png,svg}')
        .dest('public/dist/images/junkcars')
        .use(Imagemin.jpegtran({progressive: true}))
        .use(Imagemin.gifsicle({interlaced: true}))
        .use(Imagemin.optipng({optimizationLevel: 3}))
        .use(Imagemin.svgo())
        .run(function (err, files) {
            if(err){
            //  console.log("Ocorreu um erro durante a geração das imagens otimizadas." , err);
            }
        });

    var imagezip4 = new Imagemin();
    imagezip4.src('public/real_images/revslider/*.{gif,jpg,png,svg}')
        .dest('public/dist/images/revslider')
        .use(Imagemin.jpegtran({progressive: true}))
        .use(Imagemin.gifsicle({interlaced: true}))
        .use(Imagemin.optipng({optimizationLevel: 3}))
        .use(Imagemin.svgo())
        .run(function (err, files) {
            /*for(prop in files[0]){
              console.log("file." + prop + " = " + files[0][prop]);
            }*/
            if(err){
            //  console.log("Ocorreu um erro durante a geração das imagens otimizadas." , err);
            }
        }); 
}

