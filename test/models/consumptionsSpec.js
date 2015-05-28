describe('Consumptions', function() {
  var Consumptions, $httpBackend;
  var BASE_URL = 'http://dummy.local';

  beforeEach(module('energimolnet'));

  beforeEach(inject(function(_$httpBackend_, emConsumptions) {
    angular.module('energimolnet').constant('apiBaseUrl', BASE_URL);

    Consumptions = emConsumptions;
    $httpBackend = _$httpBackend_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingRequest();
    $httpBackend.verifyNoOutstandingExpectation();
  });

  it('should assume electricity metric unless specified', function() {
    var dummyId = 'id12345';
    var url = [BASE_URL, 'api/2.0', 'consumptions', dummyId, 'day', '20150101'].join('/');
    var urlElectricity = url + '?metrics=energy';

    $httpBackend.expectGET(urlElectricity).respond(200, {});

    Consumptions.get(dummyId, 'day', '20150101');

    $httpBackend.flush();
  });

  it('should respect the provided metrics', function() {
    var dummyId = 'id12345';
    var url = [BASE_URL, 'api/2.0', 'consumptions', dummyId, 'day', '20150101'].join('/');
    var urlFlow = url + '?metrics=flow';

    $httpBackend.expectGET(urlFlow).respond(200, {});

    Consumptions.get(dummyId, 'day', '20150101', 'flow');

    $httpBackend.flush();
  });

  it('should allow fetching multiple metrics', function() {
    var dummyId = 'id12345';
    var url = [BASE_URL, 'api/2.0', 'consumptions', dummyId, 'day', '20150101'].join('/');
    var urlFlow = url + '?metrics=flow,energy';

    $httpBackend.expectGET(urlFlow).respond(200, {});

    Consumptions.get(dummyId, 'day', '20150101', ['flow', 'energy']);

    $httpBackend.flush();
  });
});
