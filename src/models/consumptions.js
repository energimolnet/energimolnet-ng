module.exports = function(ngModule) {
  ngModule.factory('emConsumptions', [
    'emResourceFactory',
    function(resourceFactory) {
      var Consumptions = resourceFactory({default: '/consumptions'}, ['get']); // Needs more thinking on how this should work

      Consumptions.origGet = Consumptions.get;
      Consumptions.get = function get(id, granularity, ranges) {
        return Consumptions.origGet(id + '/' + granularity + '/' + ranges.join('+'));
      }

      return Consumptions;
    }
  ]);
};