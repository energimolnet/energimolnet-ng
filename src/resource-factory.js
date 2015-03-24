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
          this.deletePath = paths['delete'] || paths.get || paths.default;
          this.options = options;
        };

        if (methods.indexOf('get') > -1) {
          Resource.prototype.get = _emGetResource;
        }

        if (methods.indexOf('query') > -1) {
          Resource.prototype.query = _emQueryResource;
        }

        if (methods.indexOf('save') > -1) {
          Resource.prototype.save = _emSaveResource;
        }

        if (methods.indexOf('delete') > -1) {
          Resource.prototype.delete = _emDeleteResource;
        }

        if (options.forAccountPath != null) {
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

        if (object._id != null || this.options.saveMethod == 'PUT') {
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
        })
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
        var paths = {
          default: '/accounts/' + id + '/' + this.options.forAccountPath
        };

        return resourceFactory(paths, this.options.forAccountMethods);
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
