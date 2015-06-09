var makeUrl = require('../util/makeurl');

module.exports = function(emResourceFactory, Api) {
  var Subscribers = emResourceFactory({
    forAccount: {
      default: 'meter_subscribers',
      get: true,
      put: true,
      post: true,
      query: true,
      delete: false
    }
  });

  Subscribers._forAccount = Subscribers.forAccount;

  Subscribers.forAccount = function (account) {
    var SubscribersForAccount = Subscribers._forAccount(account);
    SubscribersForAccount.delete = _subscribersDelete;

    return SubscribersForAccount;
  };

  // Revoke meters argument determines whether the meters shared through a
  // subscription shouldshould be revoked. Default is false
  function _subscribersDelete(id, revokeMeters) {
    return Api.request({
      method: 'DELETE',
      url: makeUrl([this._config.default, id]),
      data: {
        revoke_meters: revokeMeters || false
      }
    });
  }

  return Subscribers;
};
