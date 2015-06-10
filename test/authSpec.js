describe('Energimolnet Auth', function() {
  var $httpBackend, api, auth, $window;
  var BASE_URL = 'http://dummy.local';
  var refreshToken = 'refresh1234567890';

  beforeEach(module('energimolnet'));

  beforeEach(function() {
    angular.module('energimolnet')
      .constant('apiBaseUrl', BASE_URL)
      .value('authConfig', {
        disabled: false,
        clientId: 'testClientID',
        clientSecret: 'testClientSecret',
        redirectUri: 'http://dummy.local'
      });
  });

  beforeEach(inject(function(_$httpBackend_, _$window_, energimolnetAPI, emAuth) {
    $httpBackend = _$httpBackend_;
    $window = _$window_;
    api = energimolnetAPI;
    auth = emAuth;
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingRequest();
    $httpBackend.verifyNoOutstandingExpectation();
    $window.localStorage.removeItem('emPrivateToken');
    $window.localStorage.removeItem('emRefreshToken');
    $window.localStorage.removeItem('emAccessToken');
  });

  it('should accept a private api token', function() {
    var token = 'mypriv-atetok-en1234-456789';

    auth.setPrivateToken(token);
    expect(auth.getPrivateToken()).toEqual(token);
  });

  it('should remove the private api token when set to null', function() {
    var token = 'mypriv-atetok-en1234-456789';

    auth.setPrivateToken(token);
    expect(auth.getPrivateToken()).toEqual(token);
    auth.setPrivateToken(null);
    expect(auth.getPrivateToken()).toEqual(null);
  });

  it('should accept a refresh token', function() {
    auth.setRefreshToken(refreshToken);
    expect(auth.getRefreshToken()).toEqual(refreshToken);
  });

  it('should remove a refresh token when set to null', function() {
    auth.setRefreshToken(refreshToken);
    expect(auth.getRefreshToken()).toEqual(refreshToken);
    auth.setRefreshToken(null);
    expect(auth.getRefreshToken()).toEqual(null);
  });

  it('should store refresh tokens in localStorage', function() {
    auth.setRefreshToken(refreshToken);
    expect($window.localStorage.getItem('emRefreshToken')).toEqual(refreshToken);
  });

  it('should use a stored refresh token', function() {
    $window.localStorage.setItem('emRefreshToken', refreshToken);
    expect(auth.getRefreshToken()).toEqual(refreshToken);
  });

  it('should say it is not authenticated when it has no refresh or private token', function() {
    expect(auth.isAuthenticated()).toBe(false);
  });

  it('should say it is authenticated when it has a refresh token', function() {
    auth.setRefreshToken(refreshToken);
    expect(auth.isAuthenticated()).toBe(true);
  });

  it('should say it is authenticated when it has a private token', function() {
    auth.setPrivateToken('privateToken');
    expect(auth.isAuthenticated()).toBe(true);
  });

  it('should request access tokens when perfoming an api request and no access token is available', function() {
    auth.setRefreshToken(refreshToken);

    $httpBackend.expectPOST(BASE_URL + '/oauth/token', {
      client_id: 'testClientID',
      client_secret: 'testClientSecret',
      grant_type: 'refresh_token',
      scope: 'basic',
      refresh_token: refreshToken
    }).respond(200, {
      access_token: "130f6d30ef95d9c16a82d311fb32c852c8398cbb",
      expires_in: 3600,
      refresh_token: refreshToken,
      scope: "basic",
      token_type: "Bearer"
    });

    $httpBackend.expectGET(BASE_URL + '/api/2.0/dummy').respond(400, {});

    api.request({url: '/dummy', method: 'GET'});

    $httpBackend.flush();
  });

  it('should queue multiple requests until token is fetched', function() {
    auth.setRefreshToken(refreshToken);

    $httpBackend.expectPOST(BASE_URL + '/oauth/token', {
      client_id: 'testClientID',
      client_secret: 'testClientSecret',
      grant_type: 'refresh_token',
      scope: 'basic',
      refresh_token: refreshToken
    }).respond(200, {
      access_token: "130f6d30ef95d9c16a82d311fb32c852c8398cbb",
      expires_in: 3600,
      refresh_token: refreshToken,
      scope: "basic",
      token_type: "Bearer"
    });

    $httpBackend.expectGET(BASE_URL + '/api/2.0/dummy').respond(400, {});
    $httpBackend.expectGET(BASE_URL + '/api/2.0/dummy2').respond(400, {});

    api.request({url: '/dummy', method: 'GET'});
    api.request({url: '/dummy2', method: 'GET'});

    $httpBackend.flush();
  });

  it('should reuse an existing valid access token', function() {
    // Inject a token into localStorage
    $window.localStorage.setItem('emAccessToken', JSON.stringify({
      access_token: "130f6d30ef95d9c16a82d311fb32c852c8398cbb",
      expires_at: 2146694400000,
      refresh_token: refreshToken,
      scope: "basic",
      token_type: "Bearer"
    }));

    auth.setRefreshToken(refreshToken);

    $httpBackend.expectGET(BASE_URL + '/api/2.0/dummy').respond(400, {});

    api.request({url: '/dummy'});

    $httpBackend.flush();
  });

  it('should not use expired access tokens', function() {
    // NOTE: This test will fail if time machines are invented and a time
    // traveller runs this test before the mocked date.
    $window.localStorage.setItem('emAccessToken', JSON.stringify({
      access_token: "130f6d30ef95d9c16a82d311fb32c852c8398cbb",
      expires_at: 1432462188232,
      refresh_token: refreshToken,
      scope: "basic",
      token_type: "Bearer"
    }));

    auth.setRefreshToken(refreshToken);

    $httpBackend.expectPOST(BASE_URL + '/oauth/token', {
      client_id: 'testClientID',
      client_secret: 'testClientSecret',
      grant_type: 'refresh_token',
      scope: 'basic',
      refresh_token: refreshToken
    }).respond(200, {
      access_token: "130f6d30ef95d9c16a82d311fb32c852c8398cbb",
      expires_in: 3600,
      refresh_token: refreshToken,
      scope: "basic",
      token_type: "Bearer"
    });

    $httpBackend.expectGET(BASE_URL + '/api/2.0/dummy').respond(400, {});

    api.request({url: '/dummy'});

    $httpBackend.flush();
  });

  it('should only use access token valid for the current refresh token', function() {
    $window.localStorage.setItem('emAccessToken', JSON.stringify({
      access_token: "130f6d30ef95d9c16a82d311fb32c852c8398cbb",
      expires_at: 2146694400000,
      refresh_token: 'otherRefreshToken',
      scope: "basic",
      token_type: "Bearer"
    }));

    auth.setRefreshToken(refreshToken);

    $httpBackend.expectPOST(BASE_URL + '/oauth/token', {
      client_id: 'testClientID',
      client_secret: 'testClientSecret',
      grant_type: 'refresh_token',
      scope: 'basic',
      refresh_token: refreshToken
    }).respond(200, {
      access_token: "130f6d30ef95d9c16a82d311fb32c852c8398cbb",
      expires_in: 3600,
      refresh_token: refreshToken,
      scope: "basic",
      token_type: "Bearer"
    });

    $httpBackend.expectGET(BASE_URL + '/api/2.0/dummy').respond(400, {});

    api.request({url: '/dummy'});

    $httpBackend.flush();
  });

  it('should create redirect url with a given redirect uri', function() {
    var redirectUri = 'http://dummier.localhost/path';
    var loginUrl = auth.loginUrl(redirectUri);

    var expectedUrl = BASE_URL + '/security/signin?redirect=http%3A%2F%2Fdummier.localhost%2Fpath';
    expect(loginUrl).toBe(expectedUrl);

    
  });
});
