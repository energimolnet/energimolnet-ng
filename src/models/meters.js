module.exports = function(ngModule) {
  ngModule.factory('emMeters', [
    'emResourceFactory',
    function(resourceFactory) {
      return resourceFactory({default: '/meters'}, ['get', 'query', 'save', 'delete', 'batchUpdate']);
    }
  ]);
};
