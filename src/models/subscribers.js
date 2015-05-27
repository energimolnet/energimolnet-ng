module.exports = function(emResourceFactory) {
  return emResourceFactory({
    forAccount: {
      default: 'meter_subscribers',
      get: true,
      put: true,
      post: true,
      query: true,
      delete: true
    }
  });
};
