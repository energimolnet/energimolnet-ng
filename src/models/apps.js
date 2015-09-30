module.exports = function(emResourceFactory) {
  return emResourceFactory({
    forAccount: {
      default: 'apps',
      get: true,
      query: true,
      delete: true
    }
  });
};
