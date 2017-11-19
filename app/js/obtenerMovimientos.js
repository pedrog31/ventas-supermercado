$(document).ready(function(){
	var nombre = sessionStorage.getItem("Nombre");
	var rol = sessionStorage.getItem("Rol");
	if (nombre == null || rol == null || rol != "comprador"){
		alert("Debe loguearse como comprador para poder acceder a esta página.");
		window.location="loginBanco.html";
	}else{
		$("#user").html('<i class="fa fa-fw fa-user"></i> Conectado como '+ nombre + ' - Comprador');
		
		var xhr = new XMLHttpRequest();
		var url = "https://vg0oc79lnk.execute-api.us-east-2.amazonaws.com/SuperMercado/movimientos";
		xhr.open("POST", url, true);
		//xhr.setRequestHeader( 'Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
		var json = { 
			"tipo_identificacion": sessionStorage.getItem("tipoID"),
			"identificacion": sessionStorage.getItem("ID")
		};
		console.log(json);
		var data = JSON.stringify(json);
		xhr.onreadystatechange=function() {
			if (xhr.readyState==4) {
				//console.log('Respuesta '+xhr.responseText);
				var jsonResponse = JSON.parse(xhr.responseText);
				if (jsonResponse.response == "Fail"){
					alert('El usuario no existe o la contraseña es incorrecta.');
				}else{
					var code ='<div class="table-responsive">'
					+ '<table id="movimientosTable" class="table table-bordered" id="dataTable" width="100%" cellspacing="0">'
					+  '<thead>'
					+    '<tr>'
					+      '<th align="center">ID</th>'
					+      '<th align="center">Tipo</th>'
					+      '<th align="center">Valor</th>'
					+      '<th align="center">Número cuenta</th>'
					+      '<th align="center">Fecha</th>'
					+    '</tr>'
					+  '</thead>'
					+  '<tbody>';

					//console.log(jsonResponse.length);
					for (i = 0; i < jsonResponse.length; i++) {
						if(jsonResponse[i].tipo==1){
							tipo="Ingreso";
							valor='<td align="center" style="color:green">' + jsonResponse[i].valor + '</td>';
						}else{
							tipo="Egreso";
							valor='<td align="center" style="color:red">' + jsonResponse[i].valor + '</td>';
						}
						
						code = code + '<tr>'
						+	 '<td align="center">' + jsonResponse[i].id + '</td>'
						+	 '<td align="center">' + tipo + '</td>'
						+    valor
						+    '<td align="center">' + jsonResponse[i].numeroCuenta + '</td>'
						+    '<td align="center">' + jsonResponse[i].fecha + '</td>';
					}
					code = code + '</tr></tbody> </table> </div>';
					$("#table").html(code);
					
				}
			}
		}
		xhr.send(data);
		/*$.ajax({
			crossDomain: true,
			type: 'POST',
			url: 'https://vg0oc79lnk.execute-api.us-east-2.amazonaws.com/SuperMercado/movimientos',
			contentType: 'application/json; charset=utf-8',
			datatype: 'json',
			data: json,
			success: function (data) {
				var code ='<div class="table-responsive">'
				+ '<table id="movimientosTable" class="table table-bordered" id="dataTable" width="100%" cellspacing="0">'
				+  '<thead>'
				+    '<tr>'
				+      '<th>ID</th>'
				+      '<th>Tipo</th>'
				+      '<th>Valor</th>'
				+      '<th>Número cuenta</th>'
				+      '<th>Fecha</th>'
				+	   '<th></th>'
				+    '</tr>'
				+  '</thead>'
				+  '<tbody>';

			for (i = 0; i < data.length; i++) {
				code = code + '<tr>'
						+	 '<td align="center">' + data[i].id + '</td>'
						+	 '<td align="center">' + data[i].tipo + '</td>'
						+    '<td align="center">' + data[i].valor + '</td>'
						+    '<td align="center">' + data[i].numeroCuenta + '</td>'
						+    '<td align="center">' + data[i].fecha + '</td>';
			}
		code = code + '</tr></tbody> </table> </div>';
		$("#table").html(code);
	},
    error: function (x, y, z) {
        alert("Error: "+x.responseText +"  " +x.status);
    }
	});*/
	}
});

	
function logout(){
	sessionStorage.removeItem("Nombre");
	sessionStorage.removeItem("Rol");
	window.location="loginBanco.html";
}
