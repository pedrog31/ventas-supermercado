$(document).ready(function(){
	var nombre = sessionStorage.getItem("Nombre");
	var rol = sessionStorage.getItem("Rol");
	var tipo_identificacion = sessionStorage.getItem("tipoID");
	var identificacion = sessionStorage.getItem("ID");
	if (nombre == null || rol == null || rol == "vendedor"){
		alert("Debe loguearse como comprador para poder acceder a esta página.");
		window.location="index.html";
	}else{
		$("#user").html('<i class="fa fa-fw fa-user"></i> Conectado como '+ nombre + ' - Comprador');
		var settings = {
			"async": true,
			"crossDomain": true,
			"url": "https://vg0oc79lnk.execute-api.us-east-2.amazonaws.com/SuperMercado/domicilios",
			"method": "POST",
			/*"headers": {
				"content-type": "application/json; charset=utf-8",
				"cache-control": "no-cache",
				"postman-token": "be625375-873c-3662-ad2e-e910a88e3d8e"
			},*/
			"processData": false,
			"data": "{\r\n    \"tipo_identificacion\": \"" + tipo_identificacion + "\",\r\n    \"identificacion\": \"" + identificacion + "\"\r\n  }"
		}
		$.ajax(settings).done(function (data) {
			var code ='<div class="table-responsive">'
			+ '<table id="domiciliosTable" class="table table-bordered" id="dataTable" width="100%" cellspacing="0">'
			+  '<thead>'
			+    '<tr>'
			+      '<th>Numero compra</th>'
			+      '<th>Fecha</th>'
			+      '<th>Valor base</th>'
			+      '<th>Descuento</th>'
			+      '<th>Valor domicilio</th>'
			+      '<th>Total</th>'
			+      '<th>Estado</th>'
			+      '<th>Accion</th>'
			+    '</tr>'
			+  '</thead>'
			+  '<tbody>';


			for (i = 0; i < data.length; i++) {
				var base = data[i].precio_productos + data[i].valor_descuento - data[i].precio_domicilio;
				code += '<tr>'
							+	 '<td align="center">' + data[i].idDomicilio + '</td>'
							+	 '<td align="center">' + data[i].fecha + '</td>'
							+	 '<td align="center">' + base + '</td>'
							+  '<td align="center">-' + data[i].valor_descuento + '</td>'
							+	 '<td align="center">+' + data[i].precio_domicilio + '</td>'
							+	 '<td align="center">' + data[i].precio_productos + '</td>'
							+	 '<td align="center">' + data[i].estado + '</td>';
				if (data[i].justificacion != null){
					code = code + '<td align="center"> El pedido fue rechazado: \"' +  data[i].justificacion + '\"</td>';
				}else
					if (data[i].estado == "Recibido") {
						code += '<td align="center">   -   </td>'
					}else {
						code += '<td align="center" class="dropdown">'
							+ '<button id =' + i + ' type="button" onclick="confirmarRecibido(' + data[i].idDomicilio + ');" class="btn btn-success">Confirmar recibido</button>'
							+ '</td>';
						}
			}

			code += '</tr></tbody> </table> </div>';
			if (data.length == 0) {
				code = 'Parece que no tienes domicilios en este momento :(, ¿Que esperas para comprar?';
			}
			$("#table").html(code);
		});
	}
});

function confirmarRecibido(idDomicilio) {
	$("#myModal").modal();
		
		var modalCode = "Estos son los productos de tu pedido<br>";
		var settingsProductos = {
			"async": true,
			"crossDomain": true,
			"url": "https://vg0oc79lnk.execute-api.us-east-2.amazonaws.com/SuperMercado/productosBy?domicilio=" + idDomicilio,
			"method": "GET",
			/*"headers": {
				"Access-Control-Allow-Headers": "Origin",
				"cache-control": "no-cache",
				"content-type": "application/json; charset=utf-8",
				"postman-token": "80bf795e-976a-86d2-75fc-212b4387f216"
			}*/
		}

		$.ajax(settingsProductos).done(function (productos) {

			modalCode = '<div class="table-responsive">'
			+ '<table id="domiciliosTable" class="table table-bordered" id="dataTable" width="100%" cellspacing="0">'
			+  '<thead>'
			+    '<tr>'
			+      '<th>Nombre</th>'
			+      '<th>Valor unidad</th>'
			+      '<th>Cantidad</th>'
			+      '<th>Precio</th>'
			+    '</tr>'
			+  '</thead>'
			+  '<tbody>';
			
			console.log(productos);
			for (i = 0; i < productos.length; i++) {
				var precio = productos[i].precio * productos[i].cantidad
				modalCode += '<tr>'
							+	 '<td align="center">' + productos[i].nombre + '</td>'
							+	 '<td align="center">' + productos[i].precio + '</td>'
							+	 '<td align="center">' + productos[i].cantidad + '</td>'
							+  '<td align="center">-' + precio + '</td>';
			}

			modalCode += '</tr></tbody> </table> </div>';
			});

			var modalButtonsCode =  '<button type="button" class="btn btn-default" data-dismiss="modal">Cancelar :|</button>'
													 +	'<button type="button" class="btn btn-default" onclick="rechazarDomicilio(' + idDomicilio + ');" class="btn btn-success">Rechazar domicilio :(</button>'
													 +	'<button type="button" class="btn btn-default" onclick="aceptarDomicilio(' + idDomicilio + ');" class="btn btn-success">Aceptar domicilio :)</button>';
			$("#modalButtonBody").html(modalButtonsCode);
			console.log(modalCode);
			$("#modalBody").html(modalCode);
}

function rechazarDomicilio(idDomicilio) {
	var justificacionCode = 'Lamentamos escuchar esto, por favor cuentanos por que no deseas recibir la compra. <br><br>'
												+ '<textarea id="justificacionTextArea" rows="4" cols="50"> </textarea>';
	var modalButtonsCode = '<button type="button" class="btn btn-default" onclick="confirmarRechazo(' + idDomicilio + ');" class="btn btn-success" data-dismiss="modal">Aceptar</button>';
	$("#modalButtonBody").html(modalButtonsCode);
	$("#modalBody").html(justificacionCode);
}

function aceptarDomicilio(idDomicilio) {
	var settings = {
  "async": true,
  "crossDomain": true,
  "url": "https://vg0oc79lnk.execute-api.us-east-2.amazonaws.com/SuperMercado/domicilios",
  "method": "PUT",
  /*"headers": {
    "content-type": "application/json",
    "cache-control": "no-cache",
    "postman-token": "54c2f14b-deaa-1f9e-b0ce-9e395b4392da"
  },*/
  "processData": false,
  "data": "{\n    \"idDomicilio\": " + idDomicilio + "\n  }\n"
}

$.ajax(settings).done(function (response) {
  if (response.message == 'Ok') {
		var mensaje = 'Gracias por preferirnos, exitos';
		$("#modalBody").html(mensaje);

		var modalButtonsCode = '<button type="button" class="btn btn-default" data-dismiss="modal">Aceptar</button>';
		$("#modalButtonBody").html(modalButtonsCode);
		window.location="domiciliosC.html";
	}
});
}

function confirmarRechazo(idDomicilio) {
	var justificacion = document.getElementById('justificacionTextArea').value;
	/*var rechazoSettings = {
		"async": true,
		"crossDomain": true,
		"url": "https://vg0oc79lnk.execute-api.us-east-2.amazonaws.com/SuperMercado/domicilios",
		"method": "DELETE",
		"headers": {
			"Access-Control-Allow-Origin": "true"
		},
		"processData": false,
		"data": "{\r\n    \"idDomicilio\": \"" + idDomicilio + "\",\r\n    \"justificacion\": \"" + justificacion + "\",\r\n   \"fecha\": \"" + new Date() + "\",\r\n  }"
		
		
	}*/
	
	var xhr = new XMLHttpRequest();
		var url = "https://vg0oc79lnk.execute-api.us-east-2.amazonaws.com/SuperMercado/domicilios";
		xhr.open("DELETE", url, true);
		//xhr.setRequestHeader( 'Access-Control-Allow-Headers', 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token');
		var rechazo = { 
			"idDomicilio": idDomicilio,
			"justificacion": justificacion,
			"fecha": new Date()
		}; 
		var data = JSON.stringify(rechazo);
		console.log(data);
		//alert('Json data: ' +data);
		xhr.onreadystatechange=function() {
			if (xhr.readyState==4) {
				console.log(xhr.responseText);
				var jsonResponse = JSON.parse(xhr.responseText);
				if (jsonResponse.response == "Fail"){
					alert('Error: '+jsonResponse.message);
				}else{
					alert(jsonResponse.message);
					var codeRechazo = jsonResponse.message;
					$("#modalBody").html(codeRechazo);
					window.location="domiciliosC.html";
				}
			}
		}
		xhr.send(data);

/*
	$.ajax(rechazoSettings).done(function (dataRechazo) {
		var codeRechazo = dataRechazo.message
		$("#modalBody").html(codeRechazo);
	});*/
}

function logout(){
	sessionStorage.removeItem("Nombre");
	sessionStorage.removeItem("Rol");
	window.location="index.html";
}
