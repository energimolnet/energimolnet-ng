module.exports = function(emResourceFactory) {
  return emResourceFactory({
    forAccount: {
      default: 'subaccounts',
      get: '/accounts',
      put: true,
      post: true,
      query: true,
      delete: '/accounts'
    }
  });
};
