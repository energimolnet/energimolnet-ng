var PATH_ASSIGN = '/meters/many/assign_to';
var PATH_SHARE = '/meters/many/share_with';
var PATH_REVOKE = '/meters/many/revoke';

module.exports = function(emResourceFactory, energimolnetAPI) {
  var Meters = emResourceFactory({
    default: '/meters',
    get: true,
    query: true,
    put: true,
    post: true,
    delete: true,
    batch: true
  });

  Meters.assign = _emShareAssign(PATH_ASSIGN);
  Meters.share = _emShareAssign(PATH_SHARE);
  Meters.revoke = _emRevoke;

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

      return energimolnetAPI.request({
        url: url,
        method: 'POST',
        data: data
      });
    };
  }

  function _emRevoke(meterIds) {
    return energimolnetAPI.request({
      url: PATH_REVOKE,
      method: 'PUT',
      data: meterIds
    });
  }
};
