function InsertarVenta(){	
		var xhr = new XMLHttpRequest();		
		var url = "https://vg0oc79lnk.execute-api.us-east-2.amazonaws.com/SuperMercado/ventas";
		data = {
				Comprador_tipo_identificacion: "CC",
				Comprador_identificacion: "10293456",
				precio_productos: 150000,
				fecha: "2017-01-19 03:14:07",
				valor_descuento: 0,
				productos: [
				{
					sku: "7702047016633",
					cantidad: 20
				},
					{
						sku: "7702189017604",
						cantidad: 12
					}	
				]					
		}
		xhr.open("POST", url, true);
	
		xhr.send(data);
}