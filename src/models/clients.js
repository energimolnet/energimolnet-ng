module.exports = function(ngModule) {
  ngModule.factory('emClients', [
    'emResourceFactory',
    function(resourceFactory) {
      return resourceFactory(
        {
          default: '/clients'
        },
        ['get', 'save', 'query', 'delete'],
        {
          forAccountPath: 'clients',
          forAccountMethods: ['get', 'save', 'query', 'delete']
        });
    }
  ]);
};
