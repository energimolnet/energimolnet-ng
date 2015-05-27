module.exports = function(emResourceFactory) {
  return emResourceFactory({
    forAccount: {
      default: 'ftp_connections',
      get: true,
      query: true,
      put: true,
      post: true,
      delete: true
    }
  });
};
