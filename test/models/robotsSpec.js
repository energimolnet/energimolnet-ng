describe('Robots', function() {
  var Robots, $httpBackend, Url;

  beforeEach(module('energimolnet'));

  beforeEach(inject(function(_$httpBackend_, emRobots, emUrl) {
    angular.module('energimolnet').constant('apiBaseUrl', 'http://dummy.local/');

    Robots = emRobots;
    $httpBackend = _$httpBackend_;
    Url = emUrl;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingRequest();
    $httpBackend.verifyNoOutstandingExpectation();
  });

  it('should query API with correct run parameters', function() {
    var robotId = 'abcd';
    var url = Url.url([Robots.getPath, robotId, 'run']);

    $httpBackend.expectPOST(url).respond(200, {});

    Robots.run(robotId);

    $httpBackend.flush();
  });
});
