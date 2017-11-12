$(document).ready(function(){ 
	var nombre = sessionStorage.getItem("Nombre");
	var rol = sessionStorage.getItem("Rol");
	if (nombre == null || rol == null || rol == "vendedor"){
		alert("Debe loguearse como comprador para poder acceder a esta página.");
		window.location="index.html";
	}else{
				
		$("#user").html('<i class="fa fa-fw fa-user"></i> Conectado como '+ nombre + ' - Comprador');
		var compraJson = sessionStorage.getItem("Compra");
		var compra = JSON.parse(compraJson);
		var total=document.getElementById('valor');
		var domicilio=document.getElementById('domicilioLabel');
		var descuento=document.getElementById('descuento');
		
		total.innerHTML = '<div><b>Su compra tendrá un valor de: $'+compra.precio_productos+'</div>';
		
		if(sessionStorage.getItem("descuento") == "true"){
					code = '<div class="form-group">'
					+ '<label for="descuento">Tiene <b>descuento</b>, desea usarlo?</label>'
					+ '<div class="col-xs-5 selectContainer">'
					+ '<select class="form-control" name="descuento" id="descuento">'
					+ '<option value="no">No</option>'
					+ '<option value="yes">Si</option>'
					+ '</select></div></div>';
					
					$("#descuentoDiv").html(code);
					var selectDescuento= document.getElementById("descuento");
					selectDescuento.addEventListener('change',
					function(){
						var selectedOption = this.options[selectDescuento.selectedIndex];
						if(selectedOption.text == "Si"){
							descuento.innerHTML = '<b>- $'+(compra.precio_productos*0.1)+' de descuento';
						}else{
							descuento.innerHTML = "";
						}
					});	
					
		}else{
			$("#descuentoDiv").html("");
		}
				
		var selectDomicilio = document.getElementById("domicilio");
		selectDomicilio.addEventListener('change',
			function(){
				var selectedOption = this.options[selectDomicilio.selectedIndex];
				if(selectedOption.text == "Si"){
					if(compra.precio_productos*0.05 > 5000){
						domicilio.innerHTML = '<b>+ $'+(compra.precio_productos*0.05)+' de domicilio';
						compra.domicilio = compra.precio_productos*0.05;
					}else{
						domicilio.innerHTML = '<b>+ $5000 de domicilio';
						compra.domicilio = 5000;
					}
				}else{
					delete compra.domicilio;
					domicilio.innerHTML = "";
				}
				sessionStorage.setItem("Compra",JSON.stringify(compra));
			});	
		var selectModoPago = document.getElementById("modoPago");
		selectModoPago.addEventListener('change',
			function(){
				var selectedOption = this.options[selectModoPago.selectedIndex];
				if(selectedOption.text == "Cuenta de ahorros"){
					code = '<div class="card">'
					+ '<div class="card-header" style="background-color: #BDE0F7;">Ingrese sus datos de pago</div>'
					+ '<div class="card-body">'
					+ '<div class="form-group"><label for="numeroTarjeta">Numero tarjeta:</label>'
					+ '<br><input class="form-control" name="numeroTarjeta" id="numeroTarjeta" type="number" min="0"></input>'
					+ '</div>'
					+ '<div class="form-group"><label for="fechaTarjeta">Fecha tarjeta:</label>'
					+ '<br><input class="form-control" name="fechaTarjeta" id="fechaTarjeta" type="date"></input>'
					+ '</div>'
					+ '</div></div><br>';
					
					$("#pagoTarjeta").html(code);
					
				}else{
					$("#pagoTarjeta").html("");
				}
			});
	} 
});

function comprar(){
	var compraJson = sessionStorage.getItem("Compra");
	var data = JSON.parse(compraJson);
	var selectModoPago = document.getElementById("modoPago");
	var selectedOption = selectModoPago.options[selectModoPago.selectedIndex];
	
	if (sessionStorage.getItem("descuento") == "true"){
		var selectDescuento = document.getElementById("descuento");
		var descuento = selectDescuento.options[selectDescuento.selectedIndex];
		if(descuento.text == "Si"){
			data.valor_descuento = data.precio_productos*0.1;
		}else{
			data.valor_descuento = 0;
		}
	}else{
		data.valor_descuento = 0;
	}
	if(selectedOption.text == "Cuenta de ahorros"){
		console.log($('#numeroTarjeta').val());
		console.log($('#fechaTarjeta').val());
		if($('#numeroTarjeta').val()!="" && $('#fechaTarjeta').val()!=""){
			data.numeroCuenta=$('#numeroTarjeta').val();
			data.fechaVencimiento=$('#fechaTarjeta').val();
			var xhr = new XMLHttpRequest();
			var url = "https://vg0oc79lnk.execute-api.us-east-2.amazonaws.com/SuperMercado/ventas";
			xhr.open("POST", url, true);
			var data = JSON.stringify(data);
			console.log(data);
			//xhr.setRequestHeader( 'Access-Control-Allow-Headers', 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token');
			xhr.onreadystatechange=function() {
				if (xhr.readyState==4) {
					var responseText = xhr.responseText;
					if (responseText.indexOf("error") !== -1){
						var res = responseText.split("error");
						var message = "Error:";
						for(i=0;i<res.length;i++){
							message= message + res[i]+" ";
						}
						message = message.replace("{", "");
						message = message.replace("}", "");
						message = message.replace(/"/g, "");
						message = message.replace(/\\/g, "");
						message = message.replace("u00e1", "á");
						message = message.replace("u00e9", "é");
						message = message.replace("u00ed", "í");
						message = message.replace("u00f3", "ó");
						message = message.replace("u00fa", "ú");
						message = message.replace("[", "");
						message = message.replace("]", "");
						console.log(message);
						alert(message);
						if(responseText.indexOf("existente") !== -1){ //Si el error es por stock lo devuelve a la pagina de los productos
							window.location="productosC.html";
						}
					}else{
						if (data.valor_descuento != 0){ //Uso el descuento
							sessionStorage.setItem("descuento", "false");
						}
						alert("Venta registrada con éxito, gracias por su compra.");
						window.location="productosC.html";
					}
				}
			}
			xhr.send(data);
			
		}else{
			alert("Para pagar con tarjeta debe ingresar los datos.");
		}
	}else{
		console.log(JSON.stringify(data));
		var xhr = new XMLHttpRequest();
		var url = "https://vg0oc79lnk.execute-api.us-east-2.amazonaws.com/SuperMercado/ventas";
		xhr.open("POST", url, true);
		var data = JSON.stringify(data);
		xhr.onreadystatechange=function() {
			if (xhr.readyState==4) {
				var responseText = xhr.responseText;
				if (responseText.indexOf("error") !== -1){
					var res = responseText.split("error");
					var message = "Error:";
					for(i=0;i<res.length;i++){
						message= message + res[i]+" ";
					}
					message = message.replace(/"/g, "");
					message = message.replace(/\\/g, "");
					message = message.replace("u00e1", "á");
					message = message.replace("u00e9", "é");
					message = message.replace("u00ed", "í");
					message = message.replace("u00f3", "ó");
					message = message.replace("u00fa", "ú");
					message = message.replace("[", "");
					message = message.replace("]", "");
					console.log(message);
					alert(message);
					if(responseText.indexOf("existente") !== -1){ //Si el error es por stock lo devuelve a la pagina de los productos
						window.location="productosC.html";
					}
				}else{
					if (data.valor_descuento != 0){ //Uso el descuento
						sessionStorage.setItem("descuento", "false");
					}
					alert("Venta registrada con éxito, gracias por su compra.");
					window.location="productosC.html";
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
