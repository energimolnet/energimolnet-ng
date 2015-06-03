describe('Energimolnet API', function() {
  var $httpBackend, api, auth;
  var BASE_URL = 'http://dummy.local';
  var refreshToken = 'refresh1234567890';

  beforeEach(module('energimolnet'));

  beforeEach(function() {
    angular.module('energimolnet')
      .constant('apiBaseUrl', BASE_URL)
      .value('authConfig', {disabled: false});
  });

  beforeEach(inject(function(_$httpBackend_, _$rootScope_, energimolnetAPI, emAuth) {
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
    api = energimolnetAPI;
    auth = emAuth;
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingRequest();
    $httpBackend.verifyNoOutstandingExpectation();
    auth.setPrivateToken(null);
  });

  it('should paginate query results', function() {
    auth.setPrivateToken('testing');

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
    auth.setPrivateToken('testing');

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

  it('should attach private token', function() {
    auth.setPrivateToken('testToken');

    $httpBackend.expectGET(BASE_URL + '/api/2.0/item', {
      Authorization: 'OAuth testToken',
      Accept:"application/json, text/plain, */*"
    }).respond(200, {});

    api.request({url: '/item', method: 'GET'});
    $httpBackend.flush();
  });

  it('should remove private token on auth error', function() {
    auth.setPrivateToken('invalidToken');

    $httpBackend.expectGET(BASE_URL + '/api/2.0/item').respond(401, {no: 'way!'});
    api.request({url: '/item', method: 'GET'});

    expect(auth.getPrivateToken()).toBe('invalidToken');
    $httpBackend.flush();
    expect(auth.getPrivateToken()).toBeNull();
  });

  it('should broadcast em:loginNeeded messages on $rootScope on auth errors', function() {
    angular.module('energimolnet')
      .value('authConfig', {disabled: false});

    var loginNeededCount = 0;

    $rootScope.$on('em:loginNeeded', function() {
      loginNeededCount++;
      expect(loginNeededCount).toBe(1);
    });

    api.request({url: '/me'});
    $rootScope.$digest();
  });
});
