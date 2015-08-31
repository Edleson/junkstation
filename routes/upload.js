var express  = require('express')	;
var router 	 = express.Router()		;
var multer   = require('multer')  	;
var AWS      = require('aws-sdk') 	;


var accessKeyId     = process.env.AWSAccessKeyId   || null;
var secretAccessKey = process.env.AWSSecretKey     || null;

if(accessKeyId === null || secretAccessKey === null){
    console.log("Variáveis de Ambiente AWSAccessKeyId ou AWSSecretKey não foram encontradas");
}else{
    console.log("Configuração AWS realizada com sucesso!");
}
console.log(accessKeyId);
console.log(secretAccessKey);

AWS.config.update({
    accessKeyId   	: accessKeyId   	,
    secretAccessKey : secretAccessKey
});

var s3 = new AWS.S3();

var storage = multer.memoryStorage()
var upload  = multer({ storage: storage });

//console.log(upload);

router.post('/add', upload.single('imagem') ,  function(req, res, next) {
	var file 	=  req.file;
	var data 	=  file.buffer;

	console.log(file);

    var day = 86400000

	var params = {
        Bucket              : 'junkstation'         ,
        Key                 : file.originalname     ,
		ACL                 : 'public-read'		    ,
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


    /*s3.getSignedUrl('putObject', params, function (error, url) {
    	if (error) {
        	console.log("Error uploading data: ", error);
        	res.redirect("/upload/form?error=" + error);
        } else {
        	console.log(url);
        	res.redirect("/upload/form?url=" + url);
        }
  		
	});*/

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

router.get('/form', function(req, res, next) {
	res.render('upload');
});

module.exports = router;