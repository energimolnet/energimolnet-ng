describe('Resource Factory', function() {
  var resourceFactory, $httpBackend, Url;

  beforeEach(module('energimolnet'));

  beforeEach(function() {
    angular.module('energimolnet').constant('apiBaseUrl', 'http://dummy.local/');
  });

  beforeEach(inject(function(_$httpBackend_, emResourceFactory, emUrl) {
    $httpBackend = _$httpBackend_;
    resourceFactory = emResourceFactory;
    Url = emUrl;
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingRequest();
    $httpBackend.verifyNoOutstandingExpectation();
  });

  it('should create services with the appropriate methods', function() {
    var collection = resourceFactory({default: '/test'}, ['get', 'save', 'query', 'delete']);

    expect(collection.get).toBeDefined();
    expect(collection.save).toBeDefined();
    expect(collection.query).toBeDefined();
    expect(collection.delete).toBeDefined();
  });

  it('should return collections that return new ones using the forAccount method', function() {
    var collection = resourceFactory({}, [], {
      forAccountPath: 'testcollection',
      forAccountMethods: ['get', 'query'] 
    });

    var url = Url.url(['accounts', '12345', 'testcollection', '67890']);
    $httpBackend.expectGET(url).respond(200, {});

    var forAccountCollection = collection.forAccount("12345");
    forAccountCollection.get("67890");

    $httpBackend.flush();
  });

  it('should respect individual paths for different http methods', function() {
    var collection = resourceFactory({
      default: '/default',
      get: '/get',
      save: '/save',
      query: '/query',
      batchUpdate: '/batch'
    }, ['get', 'save', 'query', 'batchUpdate', 'delete']);

    $httpBackend.expectGET(Url.url(['get', '12345'])).respond(200, {});
    $httpBackend.expectPOST(Url.url('save')).respond(200, {});
    $httpBackend.expectPUT(Url.url(['save', '12345'])).respond(200, {});
    $httpBackend.expectDELETE(Url.url(['default', '12345'])).respond(200, {});
    $httpBackend.expectPUT(Url.url('batch')).respond(200, {});

    collection.get('12345');
    collection.save({newItem: 'value'});
    collection.save({_id: '12345', value: 'value'});
    collection.delete('12345');
    collection.batchUpdate(['12345', '67890'], {value: true});

    $httpBackend.flush();
  });
}); 
