describe('Robots', function() {
  var Robots, $httpBackend;
  var BASE_URL = 'http://dummy.local';

  beforeEach(module('energimolnet'));

  beforeEach(inject(function(_$httpBackend_, emRobots) {
    angular.module('energimolnet')
      .constant('apiBaseUrl', BASE_URL)
      .value('authConfig', {disabled: true});

    Robots = emRobots;
    $httpBackend = _$httpBackend_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingRequest();
    $httpBackend.verifyNoOutstandingExpectation();
  });

  it('should query API with correct run parameters', function() {
    var robotId = 'abcd';
    var url = [BASE_URL, 'api/2.0', 'robots', robotId, 'run'].join('/');

    $httpBackend.expectPOST(url).respond(200, {});

    Robots.run(robotId);

    $httpBackend.flush();
  });
});
