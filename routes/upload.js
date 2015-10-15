var multer   = require('multer')  	;
var AWS      = require('aws-sdk') 	;

module.exports = function(app) {
    var security        = app.get("security");
    var isLoggedIn      = require('./../middlewares/loginHandler');
    var accessKeyId     = process.env.AWSAccessKeyId   || null;
    var secretAccessKey = process.env.AWSSecretKey     || null;
    var s3              = new AWS.S3();
    var storage         = multer.memoryStorage()
    var upload          = multer({ storage: storage });
    
    AWS.config.update({
        accessKeyId     : accessKeyId       ,
        secretAccessKey : secretAccessKey
    });
    
    if(accessKeyId === null || secretAccessKey === null){
        console.log("Variáveis de Ambiente AWSAccessKeyId ou AWSSecretKey não foram encontradas");
    }else{
        console.log("Configuração AWS realizada com sucesso!");
    }

    app.post('/upload/add', isLoggedIn,security.forceHTTPS, upload.single('imagem') ,  function(req, res, next) {
        var file    =  req.file;
        var data    =  file.buffer;
        var day     = 86400000
        
        var params = {
            Bucket              : 'junkstation'         ,
            Key                 : file.originalname     ,
            ACL                 : 'public-read'         ,
            Body                : data                  ,
            CacheControl        : 'max-age='+86400000   ,
            ContentDisposition  : file.originalname     ,
            ContentEncoding     : file.encoding         ,
            ContentLanguage     : 'pt-br'               ,
            ContentLength       : file.size             ,
            //ContentMD5          : 'STRING_VALUE'        ,
            ContentType         : file.mimetype        ,
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

        res.render('upload');
    });

    app.get('/upload/form', function(req, res, next) {
        res.render('upload');
    });

};