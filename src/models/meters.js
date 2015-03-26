module.exports = function(ngModule) {
  ngModule.factory('emMeters', [
    'emResourceFactory',
    'energimolnetAPI',
    'emUrl',
    function(resourceFactory, Api, Url) {
      var Meters = resourceFactory({default: '/meters'}, ['get', 'query', 'save', 'delete', 'batchUpdate']);

      Meters.assign = _emShareAssign('/meters/many/assign');
      Meters.share = _emShareAssign('/meters/many/share');

      return Meters;

      function _emShareAssign(url) {
        return function(meterIds, accountIds) {
          var data = [];

          var metersLength = meterIds.length;
          var accountsLength = accountIds.length;

          for (var i = 0; i < metersLength; i++) {
            var meterId = meterIds[i];

            for (var j = 0; j < accountsLength; j++) {
              var accountId = accountIds[j];

              data.push({
                _id: meterId,
                holder: accountId
              });
            }
          }

          return Api.request({
            url: Url.url(url),
            method: 'POST',
            data: data
          });
        };
      }
    }
  ]);
};
