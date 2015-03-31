module.exports = function(ngModule) {
  ngModule.factory('emConsumptions', [
    'emResourceFactory',
    function(resourceFactory) {
      var Consumptions = resourceFactory(
        {default: '/consumptions'},
        ['get'],
        {
          forAccountPath: 'consumptions',
          forAccountMethods: 'save',
          forAccountOptions: {
            saveMethod: 'PUT'
          }
        }
      );

      Consumptions.origGet = Consumptions.get;

      Consumptions.get = function get(id, granularity, ranges) {
        return Consumptions.origGet(id + '/' + granularity + '/' + ranges.join('+'));
      };

      return Consumptions;
    }
  ]);
};
