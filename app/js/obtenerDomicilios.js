$(document).ready(function(){
	var nombre = sessionStorage.getItem("Nombre");
	var rol = sessionStorage.getItem("Rol");
	var tipo_identificacion = sessionStorage.getItem("tipoID");
	var identificacion = sessionStorage.getItem("ID");
	if (nombre == null || rol == null || rol == "comprador"){
		alert("Debe loguearse como vendedor para poder acceder a esta página.");
		window.location="index.html";
	}else{
		$("#user").html('<i class="fa fa-fw fa-user"></i> Conectado como '+ nombre + ' - Vendedor');
		var settings = {
			"async": true,
			"crossDomain": true,
			"url": "https://vg0oc79lnk.execute-api.us-east-2.amazonaws.com/SuperMercado/domicilios",
			"method": "GET",
			"headers": {
				"content-type": "application/json; charset=utf-8",
				"cache-control": "no-cache",
				"postman-token": "be625375-873c-3662-ad2e-e910a88e3d8e"
			},
			"processData": false
		}
		$.ajax(settings).done(function (data) {
			var code ='<div class="table-responsive">'
			+ '<table id="domiciliosTable" class="table table-bordered" id="dataTable" width="100%" cellspacing="0">'
			+  '<thead>'
			+    '<tr>'
			+      '<th>Numero de domicilio</th>'
			+      '<th>Documento del comprador</th>'
			+      '<th>Fecha</th>'
			+      '<th>Valor descuento</th>'
			+      '<th>Precio domicilio</th>'
			+      '<th>Precio total</th>'
			+      '<th>Estado</th>'
			+      '<th>Justificacion</th>'
			+    '</tr>'
			+  '</thead>'
			+  '<tbody>';

			for (i = 0; i < data.length; i++) {
				code += '<tr>'
							+	 '<td align="center">' + data[i].idDomicilio + '</td>'
							+	 '<td align="center">' + data[i].Comprador_documento + '</td>'
							+	 '<td align="center">' + data[i].fecha + '</td>'
							+  '<td align="center">' + data[i].valor_descuento + '</td>'
							+	 '<td align="center">' + data[i].precio_domicilio + '</td>'
							+	 '<td align="center">' + data[i].precio_productos + '</td>'
							+	 '<td align="center">' + data[i].estado + '</td>'
				if (data[i].justificacion == null){
					code = code + '<td align="center"> - </td>';
				}else
					code = code + '<td align="center">' + data[i].justificacion + '</td>';
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
