$(document).ready(function(){
	var nombre = sessionStorage.getItem("Nombre");
	var rol = sessionStorage.getItem("Rol");
	if (nombre == null || rol == null || rol != "vendedor"){
		alert("Debe loguearse como vendedor para poder acceder a esta página.");
		window.location="login.html";
	}else{
		$("#user").html('<i class="fa fa-fw fa-user"></i> Conectado como '+ nombre + ' - Vendedor');
		$.ajax({
	crossDomain: true,
	type: 'GET',
    url: 'https://j6klah0fic.execute-api.us-east-2.amazonaws.com/SuperMarket/compradores',
    contentType: 'application/json; charset=utf-8',
	datatype: 'jsonp',
    success: function (data) {
		var code ='<div class="table-responsive">'
				+ '<table id="compradoresTable" class="table table-bordered" id="dataTable" width="100%" cellspacing="0">'
				+  '<thead>'
				+    '<tr>'
				+      '<th>Documento</th>'
				+      '<th>Nº documento</th>'
				+      '<th>Nombre</th>'
				+      '<th>¿Descuento?</th>'
				+    '</tr>'
				+  '</thead>'
				+  '<tbody>';

		for (i = 0; i < data.length; i++) {
			code = code + '<tr>'
						+	 '<td align="center">' + data[i].tipo_identificacion + '</td>'
						+	 '<td align="center">' + data[i].identificacion + '</td>'
						+    '<td align="center">' + data[i].nombre_completo + '</td>';
			if (data[i].descuento == true)
				code = code + '<td align="center"> Si </td>';
			else
				code = code + '<td align="center" class="dropdown">'
							+ '<button id =' + i + ' type="button" onclick="generarCupon( \'' + data[i].tipo_identificacion +'\' ,'+ data[i].identificacion + ');" class="btn btn-default">Agregar cupon</button>'
							+ '</td>';
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


function generarCupon(tipo_identificacion, Identificacion) {
		var xhr = new XMLHttpRequest();
		var url = "https://j6klah0fic.execute-api.us-east-2.amazonaws.com/SuperMarket/compradores";
		xhr.open("PUT", url, true);
		var comprador = {
			"tipo_identificacion": tipo_identificacion,
  		"identificacion": Identificacion
		};
		var data = JSON.stringify(comprador);
		xhr.onreadystatechange=function() {
			if (xhr.readyState == 4) {
				console.log(xhr.responseText);
				var jsonResponse = JSON.parse(xhr.responseText);
				if (jsonResponse.response == "Ok"){
					var mymodal = $('#myModal');
					mymodal.find('.modal-body').text('El cupon a sido asignado exitosamente con el codigo "'
											 + jsonResponse.codigo + '"');
											 mymodal.modal('show');
					window.location= "compradores.html"
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
