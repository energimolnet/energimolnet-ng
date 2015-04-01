module.exports = function(ngModule) {
  ngModule.factory('emFtpConnections', [
    'emResourceFactory',
    function(resourceFactory) {
      return resourceFactory({}, [], {
        forAccountPath: 'ftp_connections',
        forAccountMethods: ['get', 'save', 'query', 'delete']
      });
    }
  ]);
};
