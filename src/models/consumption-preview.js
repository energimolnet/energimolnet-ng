module.exports = function(ngModule) {
  ngModule.factory('emConsumptionPreview', [
    'emResourceFactory',
    function(resourceFactory) {
      return resourceFactory({default: '/consumptions'}, ['get']);
    }
  ]);
};

