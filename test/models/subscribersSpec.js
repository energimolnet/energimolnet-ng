describe('Subscribers', function() {
  var Subscribers, $httpBackend, auth;
  var BASE_URL = 'http://dummy.local';

  beforeEach(module('energimolnet'));

  beforeEach(inject(function(_$httpBackend_, emAuth, emSubscribers) {
    angular.module('energimolnet')
      .constant('apiBaseUrl', BASE_URL)
      .value('authConfig', {disabled: true});

    Subscribers = emSubscribers;
    $httpBackend = _$httpBackend_;
    auth = emAuth;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingRequest();
    $httpBackend.verifyNoOutstandingExpectation();
  });

  it('should attach a revoke_meters flag and set it to true', function() {
    var sub = Subscribers.forAccount('12345');
    var url = BASE_URL + '/api/2.0/accounts/12345/meter_subscribers/67890';

    $httpBackend.expect('DELETE', url, {revoke_meters: true}).respond(200, {});

    sub.delete('67890', true);

    $httpBackend.flush();
  });

  it('should attach a revoke_meters flag and set it to false', function() {
    var sub = Subscribers.forAccount('12345');
    var url = BASE_URL + '/api/2.0/accounts/12345/meter_subscribers/67890';

    $httpBackend.expect('DELETE', url, {revoke_meters: false}).respond(200, {});

    sub.delete('67890');

    $httpBackend.flush();
  });
});
