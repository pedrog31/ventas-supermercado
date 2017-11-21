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
			"headers": {
				"content-type": "application/json; charset=utf-8",
				"cache-control": "no-cache",
				"postman-token": "be625375-873c-3662-ad2e-e910a88e3d8e"
			},
			"processData": false,
			"data": "{\r\n    \"tipo_identificacion\": \"CC\",\r\n    \"identificacion\": \"10293456\"\r\n  }"
		}
		$.ajax(settings).done(function (data) {
			var code ='<div class="table-responsive">'
			+ '<table id="domiciliosTable" class="table table-bordered" id="dataTable" width="100%" cellspacing="0">'
			+  '<thead>'
			+    '<tr>'
			+      '<th>Numero compra</th>'
			+      '<th>Fecha</th>'
			+      '<th>Descuento</th>'
			+      '<th>Valor domicilio</th>'
			+      '<th>Total</th>'
			+      '<th>Estado</th>'
			+      '<th>Accion</th>'
			+    '</tr>'
			+  '</thead>'
			+  '<tbody>';

			for (i = 0; i < data.length; i++) {
				code += '<tr>'
							+	 '<td align="center">' + data[i].idDomicilio + '</td>'
							+	 '<td align="center">' + data[i].fecha + '</td>'
							+  '<td align="center">' + data[i].valor_descuento + '</td>'
							+	 '<td align="center">' + data[i].precio_domicilio + '</td>'
							+	 '<td align="center">' + data[i].precio_productos + '</td>'
							+	 '<td align="center">' + data[i].estado + '</td>';
				if (data[i].justificacion != null){
					code = code + '<td align="center"> El pedido fue rechazado: \"' +  data[i].justificacion + '\"</td>';
				}else
					if (data[i].estado == "Recibido") {
						code += '<td align="center">   -   </td>'
					}else {
						code += '<td align="center" class="dropdown">'
							+ '<button id =' + i + ' type="button" onclick="confirmarRecibido();" class="btn btn-success">Confirmar recibido</button>'
							+ '</td>';
						}
			}

			code += '</tr></tbody> </table> </div>';
			$("#table").html(code);
		});
	}
});

function logout(){
	sessionStorage.removeItem("Nombre");
	sessionStorage.removeItem("Rol");
	window.location="index.html";
}
