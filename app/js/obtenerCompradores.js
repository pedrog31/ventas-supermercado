$(document).ready(function(){
	var nombre = sessionStorage.getItem("Nombre");
	var rol = sessionStorage.getItem("Rol");
	if (nombre == null || rol == null || rol != "vendedor"){
		alert("Debe loguearse como vendedor para poder acceder a esta página.");
		window.location="index.html";
	}else{
		$("#user").html('<i class="fa fa-fw fa-user"></i> Conectado como '+ nombre + ' - Vendedor');
		$.ajax({
			crossDomain: true,
			type: 'GET',
			url: 'https://vg0oc79lnk.execute-api.us-east-2.amazonaws.com/SuperMercado/compradores',
			contentType: 'application/json; charset=utf-8',
			datatype: 'json',
			success: function (data) {
				var code ='<div class="table-responsive">'
				+ '<table id="compradoresTable" class="table table-bordered" id="dataTable" width="100%" cellspacing="0">'
				+  '<thead>'
				+    '<tr>'
				+      '<th>Documento</th>'
				+      '<th>Nº documento</th>'
				+      '<th>Nombre</th>'
				+      '<th>¿Descuento?</th>'
				+      '<th>Domicilios</th>'
				+	   '<th></th>'
				+    '</tr>'
				+  '</thead>'
				+  '<tbody>';

			for (i = 0; i < data.length; i++) {
			code = code + '<tr>'
						+	 '<td align="center">' + data[i].tipo_identificacion + '</td>'
						+	 '<td align="center">' + data[i].identificacion + '</td>'
						+    '<td align="center">' + data[i].nombre_completo + '</td>';
			if (data[i].descuento == true){
				code = code + '<td align="center"> Si </td>';
			}else{
				code = code + '<td align="center" class="dropdown">'
							+ '<button id =' + i + ' type="button" onclick="generarCupon( \'' + data[i].tipo_identificacion +'\' ,'+ data[i].identificacion + ');" class="btn btn-success">Agregar cupon</button>'
							+ '</td>';
			}
			code = code + '<td align="center" class="dropdown">'
							+ '<button id =' + i + ' type="button" onclick="verDomicilios( \'' + data[i].tipo_identificacion +'\' ,'+ data[i].identificacion + ');" class="btn btn-success">Ver</button>'
							+ '</td>';
			//code = code + '<td align="center" href="#">'+'<a href="#" data-toggle="modal" data-target="#deleteModal"><i class="fa fa-times" style="color:red"></i></a>'+'</td>';
			code = code + '<td align="center" href="#">'+'<button href="#" style="border: none; background: none;" onclick="borrar(\''+ data[i].tipo_identificacion +'\' ,'+ data[i].identificacion +');"><i class="fa fa-times" style="color:red"></i></button>'+'</td>';
		}
		code = code + '</tr></tbody> </table> </div>';
		$("#table").html(code);
	},
    error: function (x, y, z) {
        alert("Error: "+x.responseText +"  " +x.status);
    }
});
	}
});

function verDomicilios(tipo_identificacion, Identificacion) {
	sessionStorage.setItem("tipo_identificacion_detalle_domicilio", tipo_identificacion);
	sessionStorage.setItem("identificacion_detalle_domicilio", Identificacion);
	window.location="domicilioscadmn.html";
}


function generarCupon(tipo_identificacion, Identificacion) {
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
					/*var mymodal = $('#myModal');
					mymodal.find('.modal-body').text('El cupon a sido asignado exitosamente con el codigo "'
											 + jsonResponse.codigo + '"');
											 mymodal.modal('show');*/
					alert('El cupon a sido asignado exitosamente con el codigo "'+ jsonResponse.codigo + '"');
					window.location= "compradores.html"
				}
			}
		}
		xhr.send(data);

}


function borrar (tipo_identificacion, identificacion){
	var statusConfirm = confirm("¿Seguro quieres eliminar este usuario?");
	if (statusConfirm == true){
		var xhr = new XMLHttpRequest();
		var url = "https://vg0oc79lnk.execute-api.us-east-2.amazonaws.com/SuperMercado/usuarios";
		xhr.open("DELETE", url, true);
		//xhr.setRequestHeader( 'Access-Control-Allow-Headers', 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token');
		var eliminar_usuario = {
			"tipo_documento": tipo_identificacion,
			"documento": identificacion.toString()
		};
		var data = JSON.stringify(eliminar_usuario);
		console.log(data);
		//alert('Json data: ' +data);
		xhr.onreadystatechange=function() {
			if (xhr.readyState==4) {
				console.log(xhr.responseText);
				var jsonResponse = JSON.parse(xhr.responseText);
				if (jsonResponse.response == "Fail"){
					alert('Error: '+jsonResponse.message);
				}else{
					alert('El usuario ha sido eliminado satisfactoriamente.');
					window.location="compradores.html";
				}
			}
		}
		xhr.send(data);
	}
}

function logout(){
	sessionStorage.removeItem("Nombre");
	sessionStorage.removeItem("Rol");
	window.location="index.html";
}
