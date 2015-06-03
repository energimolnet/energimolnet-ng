describe('Resource Factory', function() {
  var resourceFactory, $httpBackend;
  var BASE_URL = 'http://dummy.local';

  beforeEach(module('energimolnet'));

  beforeEach(function() {
    angular.module('energimolnet')
      .constant('apiBaseUrl', BASE_URL)
      .value('authConfig', {disabled: true});
  });

  beforeEach(inject(function(_$httpBackend_, emResourceFactory) {
    $httpBackend = _$httpBackend_;
    resourceFactory = emResourceFactory;
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingRequest();
    $httpBackend.verifyNoOutstandingExpectation();
  });

  it('should create services with the appropriate methods', function() {
    var collection = resourceFactory({
      default: '/test',
      get: true,
      query: '/queries',
      delete: true,
      post: false
    });

    expect(collection.get).toBeDefined();
    expect(collection.save).toBeUndefined();
    expect(collection.query).toBeDefined();
    expect(collection.delete).toBeDefined();
  });

  it('should return collections that return new ones using the forAccount method', function() {
    var collection = resourceFactory({
      forAccount: {
        default: 'testcollection',
        get: true,
        query: true
      }
    });

    var url = [BASE_URL, 'api/2.0', 'accounts', '12345', 'testcollection', '67890'].join('/');
    $httpBackend.expectGET(url).respond(200, {});

    var forAccountCollection = collection.forAccount("12345");
    forAccountCollection.get("67890");

    $httpBackend.flush();
  });

  it('should respect custom paths for collections created using forAccount method', function() {
    var collection = resourceFactory({
      forAccount: {
        default: 'testcollection',
        get: '/other',
        query: 'testquery'
      }
    });

    var url = [BASE_URL, 'api/2.0', 'other', '67890'].join('/');
    $httpBackend.expectGET(url).respond(200, {});

    var forAccountCollection = collection.forAccount("12345");
    forAccountCollection.get("67890");

    $httpBackend.flush();
  });

  it('should respect individual paths for different http methods', function() {
    var collection = resourceFactory({
      default: '/default',
      get: '/get',
      post: '/post',
      put: '/put',
      query: '/query',
      batch: '/batch',
      delete: true
    });

    $httpBackend.expectGET(BASE_URL + '/api/2.0/get/12345').respond(200, {});
    $httpBackend.expectPOST(BASE_URL + '/api/2.0/post').respond(200, {});
    $httpBackend.expectPUT(BASE_URL + '/api/2.0/put/12345').respond(200, {});
    $httpBackend.expectDELETE(BASE_URL + '/api/2.0/default/12345').respond(200, {});
    $httpBackend.expectPUT(BASE_URL + '/api/2.0/batch').respond(200, {});

    collection.get('12345');
    collection.save({newItem: 'value'});
    collection.save({_id: '12345', value: 'value'});
    collection.delete('12345');
    collection.batchUpdate(['12345', '67890'], {value: true});

    $httpBackend.flush();
  });
});
