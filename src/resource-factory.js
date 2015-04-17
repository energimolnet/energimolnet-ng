/*
 * This factory generates model collections for Energimolnet.
 * Use the models found in the models folder.
 */
module.exports = function(ngModule) {
  ngModule.factory('emResourceFactory', [
    'emUrl',
    'energimolnetAPI',
    function (Url, Api) {
      function resourceFactory(paths, methods, options) {
        options = options || {};

        function Resource() {
          this.getPath = paths.get || paths.default;
          this.queryPath = paths.query || paths.default;
          this.savePath = paths.save || paths.default;
          this.deletePath = paths['delete'] || paths.default;
          this.batchUpdatePath = paths.batchUpdate || paths.default;
          this.options = options;
        }

        if (methods.indexOf('get') > -1) {
          Resource.prototype.get = _emGetResource;
        }

        if (methods.indexOf('query') > -1) {
          Resource.prototype.query = _emQueryResource;
        }

        if (methods.indexOf('save') > -1) {
          Resource.prototype.save = _emSaveResource;
        }

        if (methods.indexOf('batchUpdate') > -1) {
          Resource.prototype.batchUpdate = _emBatchUpdateResources;
        }

        if (methods.indexOf('delete') > -1) {
          Resource.prototype.delete = _emDeleteResource;
        }

        if (options.forAccountPath !== undefined) {
          Resource.prototype.forAccount = _emForAccount;
        }

        return new Resource();
      }

      function _emGetResource(id) {
        return Api.request({
          method: 'GET',
          url: Url.url([this.getPath, id])
        });
      }

      function _emSaveResource(object) {
        var method;
        var data = object;
        var urlComponents;

        if (object._id !== undefined || this.options.saveMethod === 'PUT') {
          urlComponents = [this.savePath, object._id];
          method = 'PUT';
          data = angular.copy(object);
          delete data._id;
        } else {
          method = 'POST';
          urlComponents = [this.savePath];
        }

        return Api.request({
          method: method,
          url: Url.url(urlComponents),
          data: data
        });
      }

      function _emBatchUpdateResources(ids, properties) {
        var payload = [];

        for (var i = 0, len = ids.length; i < len; i++) {
          var update = angular.copy(properties);
          update._id = ids[i];
          payload.push(update);
        }

        return Api.request({
          method: 'PUT',
          url: Url.url([this.batchUpdatePath]),
          data: payload
        });
      }

      function _emQueryResource(params) {
        return Api.request({
          method: 'GET',
          url: Url.url(this.queryPath),
          params: _removeEmpty(params)
        });
      }

      function _emDeleteResource(id) {
        return Api.request({
          method: 'DELETE',
          url: Url.url([this.deletePath, id])
        });
      }

      function _emForAccount(id) {
        var paths = this.options.forAccountPaths || {};

        if (paths.default === undefined) {
          paths.default = '/accounts/' + id + '/' + this.options.forAccountPath;
        }

        return resourceFactory(paths,
                               this.options.forAccountMethods,
                               this.options.forAccountOptions);
      }

      function _removeEmpty(object) {
        var params = {};

        for (var key in object) {
          if (!object.hasOwnProperty(key)) { continue; }

          var value = object[key];
          var isString = angular.isString(value);

          if (value != null && ((isString && value.length > 0) || !isString)) {
            params[key] = value;
          }
        }

        return params;
      }

      return resourceFactory;
    }
  ]);
};
