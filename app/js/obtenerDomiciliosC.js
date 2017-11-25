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
			"processData": false,
			"data": "{\r\n    \"tipo_identificacion\": \"" + tipo_identificacion + "\",\r\n    \"identificacion\": \"" + identificacion + "\"\r\n  }"
		}
		$.ajax(settings).done(function (data) {
			var code = '<div class="table-responsive">'
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
				var total = data[i].precio_productos - data[i].valor_descuento + data[i].precio_domicilio;
				code += '<tr>'
							+	 '<td align="center">' + data[i].idDomicilio + '</td>'
							+	 '<td align="center">' + data[i].fecha + '</td>'
							+	 '<td align="center">' + data[i].precio_productos + '</td>'
							+  '<td align="center">-' + data[i].valor_descuento + '</td>'
							+	 '<td align="center">+' + data[i].precio_domicilio + '</td>'
							+	 '<td align="center">' + total + '</td>'
							+	 '<td align="center">' + data[i].estado + '</td>';
				if (data[i].justificacion != null){
					code = code + '<td align="center">\"' +  data[i].justificacion + '\"</td>';
				}else
					if (data[i].estado == "Recibido") {
						code += '<td align="center" class="dropdown">'
							+ '<button id =' + i + ' type="button" onclick="obtenerProductos(' + data[i].idDomicilio + ');" class="btn btn-success">Ver productos</button>'
							+ '</td>';
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
			for (i = 0; i < productos.length; i++) {
				var precio = productos[i].precio * productos[i].cantidad
				modalCode += '<tr>'
							+	 '<td align="center">' + productos[i].nombre + '</td>'
							+	 '<td align="center">' + productos[i].precio + '</td>'
							+	 '<td align="center">' + productos[i].cantidad + '</td>'
							+  '<td align="center">' + precio + '</td>';
			}

			modalCode += '</tr></tbody> </table> </div>';
			$("#modalBody").html(modalCode);
			});

			var modalButtonsCode =  '<button type="button" class="btn btn-default" data-dismiss="modal">Cancelar :|</button>'
													 +	'<button type="button" class="btn btn-default" onclick="rechazarDomicilio(' + idDomicilio + ');" class="btn btn-success">Rechazar domicilio :(</button>'
													 +	'<button type="button" class="btn btn-default" onclick="aceptarDomicilio(' + idDomicilio + ');" class="btn btn-success">Aceptar domicilio :)</button>';
			$("#modalButtonBody").html(modalButtonsCode);
}

function rechazarDomicilio(idDomicilio) {
	var justificacionCode = 'Lamentamos escuchar esto, por favor cuentanos por que no deseas recibir la compra. <br><br>'
												+ '<textarea id="justificacionTextArea" rows="4" cols="50"> </textarea>';
	var modalButtonsCode = '<button type="button" class="btn btn-default" onclick="confirmarRechazo(' + idDomicilio + ');" class="btn btn-success">Aceptar</button>';
	$("#modalButtonBody").html(modalButtonsCode);
	$("#modalBody").html(justificacionCode);
}

function obtenerProductos(idDomicilio) {
	$("#myModal").modal();
		var modalCode = "Estos son los productos de tu pedido<br>";
		var settingsProductos = {
			"async": true,
			"crossDomain": true,
			"url": "https://vg0oc79lnk.execute-api.us-east-2.amazonaws.com/SuperMercado/productosBy?domicilio=" + idDomicilio,
			"method": "GET",
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
			for (i = 0; i < productos.length; i++) {
				var precio = productos[i].precio * productos[i].cantidad
				modalCode += '<tr>'
							+	 '<td align="center">' + productos[i].nombre + '</td>'
							+	 '<td align="center">' + productos[i].precio + '</td>'
							+	 '<td align="center">' + productos[i].cantidad + '</td>'
							+  '<td align="center">' + precio + '</td>';
			}

			modalCode += '</tr></tbody> </table> </div>';
			$("#modalBody").html(modalCode);
			});

			var modalButtonsCode =  '<button type="button" class="btn btn-default" data-dismiss="modal">Aceptar</button>';
			$("#modalButtonBody").html(modalButtonsCode);
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

	var xhr = new XMLHttpRequest();
		var url = "https://vg0oc79lnk.execute-api.us-east-2.amazonaws.com/SuperMercado/domicilios";
		xhr.open("DELETE", url, true);
		var rechazo = {
			"idDomicilio": idDomicilio,
			"justificacion": justificacion,
			"fecha": new Date()
		};
		var data = JSON.stringify(rechazo);
		console.log(data);
		xhr.onreadystatechange=function() {
			if (xhr.readyState==4) {
				console.log(xhr.responseText);
				var jsonResponse = JSON.parse(xhr.responseText);
				if (jsonResponse.response == "Fail"){
					alert('Error: '+jsonResponse.message);
				}else{
					console.log(jsonResponse);
					if (jsonResponse.descuento == true) {
						generarCupon(jsonResponse.message);
					}else {
						alert(jsonResponse.message);
					}
					window.location="domiciliosC.html";
				}
			}
		}
		xhr.send(data);
}

function generarCupon(mensaje) {
	var tipo_identificacion = sessionStorage.getItem("tipoID");
	var Identificacion = sessionStorage.getItem("ID");
	var xhr = new XMLHttpRequest();
	var url = "https://vg0oc79lnk.execute-api.us-east-2.amazonaws.com/SuperMercado/compradores";
	xhr.open("PUT", url, true);
	var comprador = {
		"tipo_identificacion": tipo_identificacion,
		"identificacion": Identificacion
	};
	var data = JSON.stringify(comprador);
	console.log(data);
	xhr.onreadystatechange=function() {
		if (xhr.readyState == 4) {
			console.log(xhr.responseText);
			var jsonResponse = JSON.parse(xhr.responseText);
			if (jsonResponse.response == "Ok"){
				alert(mensaje + 'El cupon a sido asignado exitosamente con el codigo "'+ jsonResponse.codigo + '"');
			}
		}
	}
	xhr.send(data);
}

function logout(){
	sessionStorage.removeItem("Nombre");
	sessionStorage.removeItem("Rol");
	window.location="index.html";
}
