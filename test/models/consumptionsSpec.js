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
    var urlElectricity = url + '?metric=energy';

    $httpBackend.expectGET(urlElectricity).respond(200, {});

    Consumptions.get(dummyId, 'day', ['20150101']);

    $httpBackend.flush();
  });

  it('should respect the provided metric', function() {
    var dummyId = 'id12345';
    var url = Url.url(['consumptions', dummyId, 'day', '20150101']);
    var urlFlow = url + '?metric=flow';

    $httpBackend.expectGET(urlFlow).respond(200, {});

    Consumptions.get(dummyId, 'day', ['20150101'], 'flow');

    $httpBackend.flush();
  });
});
