describe('Consumptions', function() {
  var Consumptions, $httpBackend, Url;

  beforeEach(module('energimolnet'));

  beforeEach(inject(function(_$httpBackend_, emConsumptions, emUrl) {
    angular.module('energimolnet').constant('apiBaseUrl', 'http://dummy.local/');

    Consumptions = emConsumptions;
    $httpBackend = _$httpBackend_;
    Url = emUrl;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingRequest();
    $httpBackend.verifyNoOutstandingExpectation();
  });

  it('should assume electricity metric unless specified', function() {
    var dummyId = 'id12345';
    var url = Url.url(['consumptions', dummyId, 'day', '20150101']);
    var urlElectricity = url + '?metrics=energy';

    $httpBackend.expectGET(urlElectricity).respond(200, {});

    Consumptions.get(dummyId, 'day', '20150101');

    $httpBackend.flush();
  });

  it('should respect the provided metrics', function() {
    var dummyId = 'id12345';
    var url = Url.url(['consumptions', dummyId, 'day', '20150101']);
    var urlFlow = url + '?metrics=flow';

    $httpBackend.expectGET(urlFlow).respond(200, {});

    Consumptions.get(dummyId, 'day', '20150101', 'flow');

    $httpBackend.flush();
  });

  it('should allow fetching multiple metrics', function() {
    var dummyId = 'id12345';
    var url = Url.url(['consumptions', dummyId, 'day', '20150101']);
    var urlFlow = url + '?metrics=flow,energy';

    $httpBackend.expectGET(urlFlow).respond(200, {});

    Consumptions.get(dummyId, 'day', '20150101', ['flow', 'energy']);

    $httpBackend.flush();
  });
});
