$(document).ready(function(){ 
	var nombre = sessionStorage.getItem("Nombre");
	var rol = sessionStorage.getItem("Rol");
	/*if (nombre == null || rol == null || rol == "vendedor"){
		alert("Debe loguearse como comprador para poder acceder a esta página.");
		window.location="index.html";
	}else{*/
		$("#user").html('<i class="fa fa-fw fa-user"></i> Conectado como '+ nombre + ' - Comprador');
		var compraJson = sessionStorage.getItem("Compra");
		var compra = JSON.parse(compraJson);
		var total=document.getElementById('valor');
		
		total.innerHTML = '<div><b>Sin domicilio su compra tendrá un valor de: $'+compra.precio_productos+'</div>';
		
		var selectDomicilio = document.getElementById("domicilio");
		selectDomicilio.addEventListener('change',
			function(){
				var selectedOption = this.options[selectDomicilio.selectedIndex];
				if(selectedOption.text == "Si"){
					if(compra.precio_productos*0.05 > 5000){
						total.innerHTML = '<div><b>Con domicilio su compra tendrá un valor de: $'+(compra.precio_productos*0.05)+'</div>';
					}else{
						total.innerHTML = '<div><b>Con domicilio su compra tendrá un valor de: $'+(compra.precio_productos+5000)+'</div>';
					}
					
				}
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
	//} 
});

function comprar(){
	
	/*var cantidad = sessionStorage.getItem("NumeroProductos");
	var totalVenta = 0;
	var arr = new Array();
	var seleccionoProductos=false;
	for(i=0; i<cantidad; i++){
		if($('#cantidadProducto'+i+'').val() > 0){
			seleccionoProductos=true;
			totalVenta = totalVenta + (parseInt($('#precioProducto'+i+'').text())*parseInt($('#cantidadProducto'+i+'').val()));
			arr.push({"sku": $('#skuProducto'+i+'').text(),"cantidad": parseInt($('#cantidadProducto'+i+'').val())});
		}
	}
	if(seleccionoProductos){
		var date = new Date();
		var fecha= date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDay()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
		var descuento=0;
		if (sessionStorage.getItem("descuento")!="null"){
			var statusConfirm = confirm("Tienes un bono de 10% de descuento ¿Deseas usarlo?"); 
			if (statusConfirm == true){ 
				descuento=totalVenta*0.1;
				totalVenta=totalVenta-descuento;
			}else{ 
				descuento=0;
			}
		}
		var domicilio;
		var confirmDomicilio = confirm("¿Deseas el servicio de domicilio por 2000$ más?"); 
		if (confirmDomicilio == true){ 
			domicilio=2000;
			totalVenta=totalVenta+domicilio;
		}else{ 
			domicilio=0;
		}	
		var compra = {
			"Comprador_tipo_identificacion": sessionStorage.getItem("tipoID"),
			"Comprador_identificacion": sessionStorage.getItem("ID"),
			"precio_productos": totalVenta,
			"fecha": fecha,
			"precio_domicilio": domicilio,
			"valor_descuento": descuento,
			"productos": arr
		}
		var data = JSON.stringify(compra);
		console.log(data);
		var xhr = new XMLHttpRequest();
		var url = "https://j6klah0fic.execute-api.us-east-2.amazonaws.com/SuperMarket/ventas";
		xhr.open("POST", url, true);
		xhr.onreadystatechange=function() {
			if (xhr.readyState==4) {
				var jsonResponse = JSON.parse(xhr.responseText);
				if (jsonResponse.response == "Fail"){
					alert('Error: '+jsonResponse.message);
				}else{
					alert(jsonResponse.message);
				}
			}
		}
		xhr.send(data);
		alert("Gracias por su compra, en unos minutos estaremos en su puerta.");
		window.location="productosC.html";
	}else{
		alert("Para hacer una compra es obvio que debe seleccionar al menos un producto.");
	}*/
}

function logout(){
	sessionStorage.removeItem("Nombre");
	sessionStorage.removeItem("Rol");
	window.location="index.html";
}
