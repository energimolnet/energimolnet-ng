module.exports = function(emResourceFactory) {
  var Accounts = emResourceFactory({
    default: '/accounts',
    get: true,
    query: true,
    put: true,
    post: true,
    delete: true
  });

  Accounts.exists = emResourceFactory({
    default: '/acccounts/exists',
    get: false,
    query: true,
    put: false,
    post: false,
    delete: false
  });

  return Accounts;
};
