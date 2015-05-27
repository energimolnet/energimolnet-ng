module.exports = function(ngModule) {
  ngModule.factory('emScrapers', [
    'emResourceFactory',
    function(resourceFactory) {
      return resourceFactory({
        default: '/scrapers',
        get: true,
        query: true
      });
    }
  ]);
};
