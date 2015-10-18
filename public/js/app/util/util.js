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

function ajaxRequest(request){
	settings = {
		url         : request.url       ,
		data  	    : request.params 	,
		async    	: true 				,
		method   	: request.method 	,
		dataType    : "json"			,
		crossDomain : true      		,
		
		beforeSend  : function( jqXHR, object){
			showBlockUI({message : "Carregando ..."}); 
		},

		success     : function( data, textStatus, jqXHR){
			request.callback(data, textStatus, jqXHR);
		},

		error       : function( jqXHR, textStatus, errorThrown){
			showGrowl("Infelizmente aconteceu algo errado durante a requisição :( , tente novamente!");
		},
		
		complete  	: function( jqXHR, textStatus ){
			hideBlockUI();
		}
	}

	$.ajax(settings);
}

function isBlankOrEmpty(value){
	return(!value || $.trim(value) === "");
}

