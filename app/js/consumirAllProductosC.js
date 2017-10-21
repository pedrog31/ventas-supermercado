$(document).ready(function(){ 
	var nombre = sessionStorage.getItem("Nombre");
	var rol = sessionStorage.getItem("Rol");
	if (nombre == null || rol == null || rol == "vendedor"){
		alert("Debe loguearse como comprador para poder acceder a esta página.");
		window.location="index.html";
	}else{
		$("#user").html('<i class="fa fa-fw fa-user"></i> Conectado como '+ nombre + ' - Comprador');
		$.ajax({
			crossDomain: true,
			type: 'GET',
			url: 'https://j6klah0fic.execute-api.us-east-2.amazonaws.com/SuperMarket/productos',
			contentType: 'application/json; charset=utf-8',
			datatype: 'jsonp',
			success: function (data) {
				var code = '<div class="row">';
				sessionStorage.setItem("NumeroProductos", data.length);
				for (i = 0; i < data.length; i++) { 
					code = code + '<div class="col-xs-4 col-md-3"><div class="card mb-3"><a href="#"><img class="card-img-top" src="'+data[i].url_foto+'" alt="" width="30" height="200"></a><div class="card-body"><h6 class="card-title mb-1"><a href="#">'+data[i].nombre+'</a></h6><small>Sku: </small><label type="text" style="font-size: 80%;" id="skuProducto'+i+'">'+data[i].sku+'</label><br><small>Precio: </small><label type="text" style="font-size: 80%;" id="precioProducto'+i+'">'+data[i].precio+'</label><br><small>Stock: '+data[i].stock+'</small></div><div class="card-body py-2 small" style="text-align: center"><div class="quantity"><button class="plus-btn" type="button" name="button"><img src="plus.svg" alt="" /></button><input type="text" name="name" value="0" id="cantidadProducto'+i+'"> <button class="minus-btn" type="button" name="button"><img src="minus.svg" alt="" /></button></div></div></div></div>';
				}
				code = code + '</div><script type="text/javascript">$(".minus-btn").on("click", function(e) {e.preventDefault();var $this = $(this);var $input = $this.closest("div").find("input");var value = parseInt($input.val());if (value > 1) {	value = value - 1;} else {	value = 0;}$input.val(value);});$(".plus-btn").on("click", function(e) {e.preventDefault();var $this = $(this);var $input = $this.closest("div").find("input");var value = parseInt($input.val());if (value < 100) {value = value + 1;} else {	value =100;}$input.val(value);});</script>';
				$("#grid").html(code);
			},
			error: function (x, y, z) {
				alert("Error: "+x.responseText +"  " +x.status);
			}
		});
	} 
});

function comprar(){
	var cantidad = sessionStorage.getItem("NumeroProductos");
	var totalVenta = 0;
	var arr = new Array();
	var seleccionoProductos=false;
	for(i=0; i<cantidad; i++){
		if($('#cantidadProducto'+i+'').val() > 0){
			seleccionoProductos=true;
			totalVenta = totalVenta + (parseInt($('#precioProducto'+i+'').text())*parseInt($('#cantidadProducto'+i+'').val()));
			arr.push({"sku": $('#skuProducto'+i+'').text(),"cantidad": $('#cantidadProducto'+i+'').val()});
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
		xhr.setRequestHeader( 'Access-Control-Allow-Headers', 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token');
		xhr.onreadystatechange=function() {
			if (xhr.readyState==4) {
				console.log(xhr.responseText);
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
		logout();
	}else{
		alert("Para hacer una compra es obvio que debe seleccionar al menos un producto.");
	}
}

function logout(){
	sessionStorage.removeItem("Nombre");
	sessionStorage.removeItem("Rol");
	window.location="index.html";
}

