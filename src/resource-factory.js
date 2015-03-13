module.exports = function(ngModule) {
  ngModule.factory('emResourceFactory', [
    'emUrl',
    'energimolnetAPI',
    function (Url, Api) {
      function resourceFactory(paths, methods, options) {
        function Resource() {
          this.getPath = paths.get || paths.default;
          this.queryPath = paths.query || paths.default;
          this.savePath = paths.save || paths.default;
          this.options = options || {};
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