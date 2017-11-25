function traerTodosDomicilios(){	
		var xhr = new XMLHttpRequest();		
		var url = "https://vg0oc79lnk.execute-api.us-east-2.amazonaws.com/SuperMercado/domicilios";
		xhr.open("GET", url, true);
		xhr.setRequestHeader( 'Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');					
		xhr.send;
}