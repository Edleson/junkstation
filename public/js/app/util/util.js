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

