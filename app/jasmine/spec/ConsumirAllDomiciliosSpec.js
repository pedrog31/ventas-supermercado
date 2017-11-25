describe('Obtener todos los domicilios', function () {
	
  // Put our http response in a variable.
  var success = {	  
      idDomicilio: 1,
      Comprador_tipo_documento: "CC",
      Comprador_documento: "10293456",
      precio_productos: 150000,
      fecha: "2017-10-19 03:14:07",
      valor_descuento: 1500,
      precio_domicilio: 7500,
      estado: "Enviado",
      justificacion: null
  }

  //Declare the variable within the suite's scope
  var request;
  beforeEach(function (done) {

    // Start listening to xhr requests
    jasmine.Ajax.install();

    //Call whatever will make the actual request
    traerTodosDomicilios();

    //Answer the request.
    request = jasmine.Ajax.requests.mostRecent();
    request.respondWith(success);
    done();
  });

  it("La petición va al destino correcto", function(done) {
    expect(request.url).toBe('https://vg0oc79lnk.execute-api.us-east-2.amazonaws.com/SuperMercado/domicilios');
    done();
  });

  it("Usa el método correcto", function(done) {
    expect(request.method).toBe('GET');
    done();
  });

  afterEach(function() {
  jasmine.Ajax.uninstall();
  });
    
})