describe('Energimolnet API tests', function() {
  var $httpBackend, api;
  var BASE_URL = 'http://dummy.local';

  beforeEach(module('energimolnet'));

  beforeEach(inject(function(_$httpBackend_, energimolnetAPI) {
    angular.module('energimolnet').constant('apiBaseUrl', 'http://dummy.local/');
    $httpBackend = _$httpBackend_;
    api = energimolnetAPI;
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingRequest();
    $httpBackend.verifyNoOutstandingExpectation();
  });

  it('should paginate query results', function() {
    $httpBackend.expectGET(BASE_URL + '/api/2.0/query').respond(200, {
      data: [{_id: '1234'}, {_id: '5678'}],
      count: 200,
      skip: 0,
      limit: 50
    });

    api.request({url: '/query', method: 'GET'})
      .then(function(res) {
        expect(res.data).toBeDefined();
        expect(res.data.length).toBe(2);
        expect(res.pagination.page).toBe(1);
        expect(res.pagination.from).toBe(1);
        expect(res.pagination.to).toBe(50);
      });

    $httpBackend.flush();
  });

  it('should not paginate single items', function() {
    $httpBackend.expectGET(BASE_URL + '/api/2.0/item').respond(200, {
      data: {_id: 'abcde'}
    });

    api.request({url: '/item', method: 'GET'})
      .then(function(item) {
        expect(item._id).toBe('abcde');
        expect(item.pagination).toBeUndefined();
      });

      $httpBackend.flush();
  });

  it('should attach apiToken', function() {
    api.setToken('testToken');

    $httpBackend.expectGET(BASE_URL + '/api/2.0/item', {
      Authorization: 'OAuth testToken',
      Accept:"application/json, text/plain, */*"
    }).respond(200, {});

    api.request({url: '/item', method: 'GET'});
    $httpBackend.flush();
  });

  it('should remove apiToken on auth error', function() {
    api.setToken('invalidToken');

    $httpBackend.expectGET(BASE_URL + '/api/2.0/item').respond(401, {no: 'way!'});
    api.request({url: '/item', method: 'GET'});

    expect(api.getToken()).toBe('invalidToken');
    $httpBackend.flush();
    expect(api.getToken()).toBeNull();
  });
});
