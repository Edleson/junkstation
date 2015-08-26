var express  = require('express')	;
var router 	 = express.Router()		;
var multer   = require('multer')  	;
var AWS      = require('aws-sdk') 	;



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

	//console.log(file);

	var params = {
		ACL    : 'public-read'		,
    	Bucket : 'junkstation' 		,
        Key    : file.originalname	,
        Body   : data
    };

    //console.log(params);

    s3.getSignedUrl('putObject', params, function (error, url) {
    	if (error) {
        	console.log("Error uploading data: ", error);
        	res.redirect("/upload/form?error=" + error);
        } else {
        	console.log(url);
        	res.redirect("/upload/form?url=" + url);
        }
  		
	});

    /*s3.putObject(params, function (error, response) {
    	if (error) {
        	console.log("Error uploading data: ", error);
        } else {
        	console.log(response);
        	console.log("Successfully uploaded data to" +  params.Bucket);
        }
    });*/

	
});

router.get('/form', function(req, res, next) {
	res.render('upload');
});

module.exports = router;