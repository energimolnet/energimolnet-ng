// This spec only tests the share feature
// as the other methods should already be tested
// in the resource-factory spec.

describe('Meters', function() {
  var Meters, $httpBackend, Url;

  beforeEach(module('energimolnet'));

  beforeEach(inject(function(_$httpBackend_, emMeters, emUrl) {
    angular.module('energimolnet').constant('apiBaseUrl', 'http://dummy.local/');

    Meters = emMeters;
    $httpBackend = _$httpBackend_;
    Url = emUrl;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingRequest();
    $httpBackend.verifyNoOutstandingExpectation();
  });

  describe('assign', function() {
    it('should allow assigning of a single meter', function() {
      var meterId = '12345';
      var accountId = '67890';
      var url = Url.url('/meters/many/assign');

      $httpBackend.expectPOST(url, '[{"_id":"12345","holder":"67890"}]').respond(200, {});

      Meters.assign([meterId], [accountId]);

      $httpBackend.flush();
    });

    it('should allow assigning of multiple meters', function() {
      var meterIds = ['12345', 'abcde', 'fghij'];
      var accountId = '67890';
      var url = Url.url('/meters/many/assign');

      $httpBackend.expectPOST(url, '[{"_id":"12345","holder":"67890"},{"_id":"abcde","holder":"67890"},{"_id":"fghij","holder":"67890"}]').respond(200, {});

      Meters.assign(meterIds, [accountId]);

      $httpBackend.flush();
    });
  });

  describe('share', function() {
    it('should allow sharing of a single meter', function() {
      var meterId = '12345';
      var accountId = '67890';
      var url = Url.url('/meters/many/share');

      $httpBackend.expectPOST(url, '[{"_id":"12345","holder":"67890"}]').respond(200, {});

      Meters.share([meterId], [accountId]);

      $httpBackend.flush();
    });

    it('should allow assigning of multiple meters', function() {
      var meterIds = ['12345', 'abcde', 'fghij'];
      var accountId = '67890';
      var url = Url.url('/meters/many/share');

      $httpBackend.expectPOST(url, '[{"_id":"12345","holder":"67890"},{"_id":"abcde","holder":"67890"},{"_id":"fghij","holder":"67890"}]').respond(200, {});

      Meters.share(meterIds, [accountId]);

      $httpBackend.flush();
    });
  });
});

