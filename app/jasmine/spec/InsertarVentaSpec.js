describe('Insertar una venta', function () {
	
  // Put our http response in a variable.
  var success = {
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
	

  //Declare the variable within the suite's scope
  var request;
  beforeEach(function (done) {

    // Start listening to xhr requests
    jasmine.Ajax.install();

    //Call whatever will make the actual request
    InsertarVenta();

    //Answer the request.
    request = jasmine.Ajax.requests.mostRecent();
    request.respondWith(success);
    done();
  });

  it("La petición va al destino correcto", function(done) {
    expect(request.url).toBe('https://vg0oc79lnk.execute-api.us-east-2.amazonaws.com/SuperMercado/ventas');
    done();
  });

  it("Usa el método correcto", function(done) {
    expect(request.method).toBe('POST');
    done();
  });

  afterEach(function() {
  jasmine.Ajax.uninstall();
  });
    
})