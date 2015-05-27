module.exports = function(emResourceFactory) {
  return emResourceFactory({
    forAccount: {
      default: 'tokens',
      get: true,
      put: true,
      post: true,
      query: true,
      delete: true
    }
  });
};
