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
      var url = Url.url('/meters/many/assign_to');

      $httpBackend.expectPOST(url, '[{"_id":"12345","holder":"67890"}]').respond(200, {});

      Meters.assign([meterId], [accountId]);

      $httpBackend.flush();
    });

    it('should allow assigning of multiple meters', function() {
      var meterIds = ['12345', 'abcde', 'fghij'];
      var accountId = '67890';
      var url = Url.url('/meters/many/assign_to');

      $httpBackend.expectPOST(url, '[{"_id":"12345","holder":"67890"},{"_id":"abcde","holder":"67890"},{"_id":"fghij","holder":"67890"}]').respond(200, {});

      Meters.assign(meterIds, [accountId]);

      $httpBackend.flush();
    });
  });

  describe('share', function() {
    it('should allow sharing of a single meter', function() {
      var meterId = '12345';
      var accountId = '67890';
      var url = Url.url('/meters/many/share_with');

      $httpBackend.expectPOST(url, '[{"_id":"12345","holder":"67890"}]').respond(200, {});

      Meters.share([meterId], [accountId]);

      $httpBackend.flush();
    });

    it('should allow assigning of multiple meters', function() {
      var meterIds = ['12345', 'abcde', 'fghij'];
      var accountId = '67890';
      var url = Url.url('/meters/many/share_with');

      $httpBackend.expectPOST(url, '[{"_id":"12345","holder":"67890"},{"_id":"abcde","holder":"67890"},{"_id":"fghij","holder":"67890"}]').respond(200, {});

      Meters.share(meterIds, [accountId]);

      $httpBackend.flush();
    });
  });

  describe('revoke', function() {
    it('should be able to revoke a single contract', function() {
      var meterId = 'abc123';
      var url = Url.url('/meters/many/revoke');

      $httpBackend.expectPUT(url, '["abc123"]').respond(200, {});

     Meters.revoke([meterId]); 

     $httpBackend.flush();
    });

    it('should be able to revoke multiple contracts', function() {
      var meterIds = ['abc123', '123abc'];
      var url = Url.url('/meters/many/revoke');

      $httpBackend.expectPUT(url, '["abc123","123abc"]').respond(200, {});

     Meters.revoke(meterIds);

     $httpBackend.flush();
    });
  });
});

