describe('Obtener todos los compradores', function () {
	
  // Put our http response in a variable.
  var success = [
    {
      tipo_identificacion: "CC",
      identificacion: "10293456",
      nombre_completo: "Sebastian Rios",
      descuento: false
    }
  ]

  //Declare the variable within the suite's scope
  var request;
  beforeEach(function (done) {

    // Start listening to xhr requests
    jasmine.Ajax.install();

    //Call whatever will make the actual request
    traerTodosCompradores();

    //Answer the request.
    request = jasmine.Ajax.requests.mostRecent();
    request.respondWith(success);
    done();
  });

  it("La petición va al destino correcto", function(done) {
    expect(request.url).toBe('https://vg0oc79lnk.execute-api.us-east-2.amazonaws.com/SuperMercado/compradores');
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