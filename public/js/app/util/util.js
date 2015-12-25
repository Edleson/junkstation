function showBlockUI(options){
	$.blockUI(
		{ 
			message : options.message , 
			css: { 
	            border: 'none', 
	            padding: '15px', 
	            backgroundColor: '#000', 
	            '-webkit-border-radius': '10px', 
	            '-moz-border-radius': '10px', 
	            opacity: .5, 
	            color: '#fff' 
        	}
        }
    );
};

function hideBlockUI(){
	$.unblockUI();
};

function showGrowl(title , message, timeout){
	$.growlUI(title , message, timeout); 
}

function ajaxRequest(request, showGifLoad){
	//console.log(request);
	
	settings = {
		url         : request.url       				,
		data  	    : request.params 					,
		async    	: true 								,
		method   	: request.method 					,
		dataType    : request.dataType | "json"		,
		crossDomain : false      		                ,				
		
		beforeSend  : function( jqXHR, object){
			if(showGifLoad){
				showBlockUI({message : "Carregando ..."}); 
			}
		},

		success     : function( data, textStatus, jqXHR){
			request.callback(data, textStatus, jqXHR);
		},

		error       : function( jqXHR, textStatus, errorThrown){
			showGrowl("Infelizmente aconteceu algo errado durante a requisição :( , tente novamente!");
		},
		
		complete  	: function( jqXHR, textStatus ){
			if(showGifLoad){
				hideBlockUI();
			}
		}
	}

	$.ajax(settings);
}

function isBlankOrEmpty(value){
	return(!value || $.trim(value) === "");
}

function humanFileSize(bytes, si) {
    var thresh = si ? 1000 : 1024;
    
    if(Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }
    var units = si
        ? ['kB','MB','GB','TB','PB','EB','ZB','YB']
        : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
    var u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while(Math.abs(bytes) >= thresh && u < units.length - 1);
    return bytes.toFixed(1)+' '+units[u];
}

function parseQueryString(str) {
    // parse will split the string along the &
    // and loop over the result

    var keyValues, i, len, el, 
        parts, key, value, result;

    result    = {};
    sepToken  = '&';
    keyValues = str.split('&');

    i   = 0;
    len = keyValues.length;

    for(i; i<len; i++) {
        el    = keyValues[i];
        parts = el.split('=');
        key   = parts[0];
        value = parts[1];

        // this will replace any duplicate param 
        // with the last value found
        result[key] = value;
    }

    return serializeQueryString(result);
}

function serializeQueryString(data) {
    // serialize simply loops over the data and constructs a new string

    var prop, result, value;

    result = [];

    for(prop in data) {
        if (data.hasOwnProperty(prop)) {
            value = data[prop];

            // push each seriialized key value into an array
            result.push(prop + '=' + value);
        }
    }

    // return the resulting array joined on &
    return result.join("&");
}

/*
if (!jQuery.support.cors && window.XDomainRequest) {
    var httpRegEx        = /^https?:\/\//i;
    var getOrPostRegEx   = /^get|post$/i;
    var sameSchemeRegEx  = new RegExp('^'+location.protocol, 'i');
    var xmlRegEx         = /\/xml/i;

    jQuery.ajaxTransport('text html xml json', function(options, userOptions, jqXHR){
        if ( options.crossDomain               && options.async                   && 
             getOrPostRegEx.test(options.type) && httpRegEx.test(userOptions.url) && 
             sameSchemeRegEx.test(userOptions.url)) {
            var xdr = null;
            var userType = (userOptions.dataType || '').toLowerCase();
            
            return {
                send: function(headers, complete){
                    xdr = new XDomainRequest();
                    
                    if (/^\d+$/.test(userOptions.timeout)) {
                        xdr.timeout = userOptions.timeout;
                    }
                    
                    xdr.ontimeout = function(){
                        complete(500, 'timeout');
                    };
                    
                    xdr.onload = function(){
                        var allResponseHeaders = 'Content-Length: ' + xdr.responseText.length + '\r\nContent-Type: ' + xdr.contentType;
                        
                        var status = {
                            code: 200,
                            message: 'success'
                        };
                        
                        var responses = {
                            text: xdr.responseText
                        };

                        try {
                            if (userType === 'json') {
                                try {
                                    responses.json = JSON.parse(xdr.responseText);
                                } catch(e) {
                                    status.code = 500;
                                    status.message = 'parseerror';
                                }
                            } else if ((userType === 'xml') || ((userType !== 'text') && xmlRegEx.test(xdr.contentType))) {
                                var doc = new ActiveXObject('Microsoft.XMLDOM');
                                doc.async = false;
                                try {
                                    doc.loadXML(xdr.responseText);
                                } catch(e) {
                                    doc = undefined;
                                }
                                if (!doc || !doc.documentElement || doc.getElementsByTagName('parsererror').length) {
                                    status.code = 500;
                                    status.message = 'parseerror';
                                    throw 'Invalid XML: ' + xdr.responseText;
                                }
                                responses.xml = doc;
                            }
                        } catch(parseMessage) {
                            throw parseMessage;
                        } finally {
                            complete(status.code, status.message, responses, allResponseHeaders);
                        }
                    };

                    xdr.onerror = function(){
                        complete(500, 'error', {
                            text: xdr.responseText
                        });
                    };
                    
                    xdr.open(options.type, options.url);
                    
                    xdr.send();
                },

                abort: function(){
                    if (xdr) {
                        xdr.abort();
                    }
                }
            };
        }
    });
};*/

