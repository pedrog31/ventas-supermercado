function register() {
	if($('#documento').val() == "" || $('#nombres').val() == "" || $('#direccion').val() == "" || $('#correo').val() == "" || $('#password1').val() == "" || $('#password2').val() == ""){
		alert('No puede dejar ningún campo vacio.');
	}else{
		if(!/^([0-9])*$/.test($('#documento').val())){
			alert('El campo -Número documento- solo admite valores numericos.');
		}else{
			if (/^([0-9])*$/.test($('#nombres').val())){
				alert('El campo -Nombres- no admite valores numericos.');
			}else{
				if($('#documento').val() == "0"){
					alert('Número de documento no puede ser igual a 0.');
				}else{
					if(!/^(?:[^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*|"[^\n"]+")@(?:[^<>()[\].,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,63}$/i.test($('#correo').val())){
						alert('Debe ingresar un Email correcto.');
					}else{
						if($('#password1').val().length <5 || $('#password2').val().length <5){
							alert('Su contraseña debe tener minimo 5 caracteres.');
						}else{
							if($('#password1').val() != $('#password2').val()){
								alert('Las contraseñas deben coincidir.');
							}else{
								var xhr = new XMLHttpRequest();
								var url = "https://vg0oc79lnk.execute-api.us-east-2.amazonaws.com/SuperMercado/usuarios";
								xhr.open("POST", url, true);
								//xhr.setRequestHeader( 'Access-Control-Allow-Headers', 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token');
								var producto = { 
									"tipo_documento": $('#tipo_documento').val(),
									"documento": $('#documento').val(),
									"correo": $('#correo').val(),
									"contraseña": $('#password1').val(),
									"nombres": $('#nombres').val(),
									"direccion": $('#direccion').val()
								}; 
								
								var data = JSON.stringify(producto);
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
											window.location="index.html";
										}
									}
								}
								xhr.send(data);
							}
						}
					}
				}
			}
		}
	}
}
