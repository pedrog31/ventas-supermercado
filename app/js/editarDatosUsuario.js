$(document).ready(function(){ 
	var nombre = sessionStorage.getItem("Nombre");
	var rol = sessionStorage.getItem("Rol");
	if (nombre == null || rol == null || rol != "comprador"){
		alert("Debe loguearse como comprador para poder acceder a esta página.");
		window.location="index.html";
	}else{
		$("#tipo_documento").val(sessionStorage.getItem("tipoID"));
		$("#documento").val(sessionStorage.getItem("ID"));
		$("#nombres").val(sessionStorage.getItem("Nombre"));
		$("#direccion").val(sessionStorage.getItem("direccion"));
		$("#correo").val(sessionStorage.getItem("email"));
		$("#password1").val(sessionStorage.getItem("pass"));
		$("#password2").val(sessionStorage.getItem("pass"));
	}
	
});

function updateData() {
	if($('#nombres').val() == "" || $('#direccion').val() == "" || $('#password1').val() == "" || $('#password2').val() == ""){
		alert('No puede dejar ningún campo vacio.');
	}else{
		if (/^([0-9])*$/.test($('#nombres').val())){
			alert('El campo -Nombres- no admite valores numericos.');
		}else{
			if($('#password1').val().length <5 || $('#password2').val().length <5){
				alert('Su contraseña debe tener minimo 5 caracteres.');
			}else{
				if($('#password1').val() != $('#password2').val()){
					alert('Las contraseñas deben coincidir.');
				}else{
					var xhr = new XMLHttpRequest();
					var url = "https://vg0oc79lnk.execute-api.us-east-2.amazonaws.com/SuperMercado/usuarios";
					xhr.open("PUT", url, true);
					//xhr.setRequestHeader( 'Access-Control-Allow-Headers', 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token');
					var producto = { 
						"tipo_documento": $('#tipo_documento').val(),
						"documento": $('#documento').val(),
						"contraseña": $('#password1').val(),
						"nombres": $('#nombres').val(),
						"direccion": $('#direccion').val()
					}; 
					var data = JSON.stringify(producto);
					//console.log(data);
					//alert('Json data: ' +data);
					xhr.onreadystatechange=function() {
						if (xhr.readyState==4) {
							console.log(xhr.responseText);
							var jsonResponse = JSON.parse(xhr.responseText);
							if (jsonResponse.response == "Fail"){
								alert('Error: '+jsonResponse.message);
							}else{
								alert('¡Sus datos han sido actualizados con exito!');
								sessionStorage.setItem("Nombre", $('#nombres').val());
								sessionStorage.setItem("direccion", $('#direccion').val());
								sessionStorage.setItem("pass", $('#password1').val());
								window.location="editarDatosUsuario.html";
							}
						}
					}
					xhr.send(data);
				}
			}
		}
		
	}	
}

function logout(){
	sessionStorage.removeItem("Nombre");
	sessionStorage.removeItem("Rol");
	window.location="index.html";
}
