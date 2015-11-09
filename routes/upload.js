var multer      = require('multer');
var AWS         = require('aws-sdk');
var fs          = require('fs');
var gm          = require('gm').subClass({imageMagick: true});
var path        = require('path');

module.exports = function(app) {
    var security        = app.get("security");
    var isLoggedIn      = require('./../middlewares/loginHandler');
    var accessKeyId     = process.env.AWS_ACCESS_KEY   || null;
    var secretAccessKey = process.env.AWS_SECRET_KEY   || null;
    var s3              = new AWS.S3();
    var storage         = multer.memoryStorage()
    var upload          = multer({ storage: storage });
     
    AWS.config.update({
        accessKeyId     : accessKeyId       ,
        secretAccessKey : secretAccessKey   ,
        sslEnabled      : true
    });

    //console.log(AWS.config);
    
    if(accessKeyId === null || secretAccessKey === null){
        console.log("Variáveis de Ambiente AWSAccessKeyId ou AWSSecretKey não foram encontradas");
    }else{
        console.log("Configuração AWS realizada com sucesso!");
    }

    app.post('/upload/add', isLoggedIn, security.forceHTTPS, upload.single('imagem') , function(req, res, next) {
        var watermark =  path.join(__dirname, "../public/real_images" , "watermark.png");
        var file      =  req.file;
        var day       =  86400000;
        var data      =  file.buffer;
        var tempDir   = '../public/tmp';

       /***********************************************************************************************
        * Aplica a marca d'água em todas as fotos com o logo da Junkstation e grava no diretório tmp  *
        ***********************************************************************************************/
        gm(data, file.originalname)
        .draw(['image Over 0,0 0,0 "'+ watermark + '"' ])
        .write(path.join(__dirname, tempDir , file.originalname), function (err) {
            if (err){
                console.log()
                return next(err);    
            }

            /***********************************************************************************************
             * Lê os arquivos do diretório temporário e envia para AMAZON S3                               *
            ***********************************************************************************************/
            fs.readFile(path.join(__dirname, tempDir , file.originalname),  function(err, buffer){
                console.log(buffer);
                
                var params = {
                    Bucket              : 'junkstation'         ,
                    Key                 : file.originalname     ,
                    ACL                 : 'public-read'         ,
                    Body                : buffer                ,
                    CacheControl        : 'max-age='+86400000   ,
                    ContentDisposition  : file.originalname     ,
                    ContentEncoding     : file.encoding         ,
                    ContentLanguage     : 'pt-br'               ,
                    ContentLength       : file.size             ,
                    //ContentMD5        : ''                    ,
                    ContentType         : file.mimetype         ,
                    Expires             : new Date 
                };

                s3.putObject(params, function (error, response) {
                    if (error) {
                        console.log("Error uploading data: ", error);
                    } else {
                        console.log(response);
                        console.log("Upload do arquivo realizado com sucesso " +  params.Bucket);
                    }
                });

            })  
        });
        

        res.render('upload');
    });

    app.get('/upload/form', function(req, res, next) {
        res.render('upload');
    });

};