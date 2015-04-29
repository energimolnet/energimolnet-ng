module.exports = function(ngModule) {
  ngModule.factory('emFtpConnections', [
    'emResourceFactory',
    function(resourceFactory) {
      return resourceFactory({
        forAccount: {
          default: 'ftp_connections',
          get: true,
          query: true,
          put: true,
          post: true,
          delete: true
        }
      });
    }
  ]);
};
