/*
 * This service performs communication with Energimolnet API.
 * It formats requests to required format and parses the 
 * responses in a suitable way.
 *
 * Unless needed, use the api models to communicate with the API
 * on a higher level.
 * I.e.:
 *
 * Do:
 *
 *   Owners.query({name: 'Halmstad'})
 * 
 * Dont':
 *
 *   energimolnetAPI.request({url: 'http://app.../owners', params:...})
 */

module.exports = function(ngModule) {
  ngModule.factory('energimolnetAPI', [
    '$http',
    '$window',
    '$q',
    function($http, $window, $q) {
      function request(config) {
        return $q(function(resolve, reject) {
          $http(_emAuthorize(config)).then(function(res) {
            if (res.data.count == null || res.data.limit == null || res.data.skip == null) {
              resolve(res.data.data);
            } else {
              resolve({
                data: res.data.data,
                pagination: {
                  skip: res.data.skip,
                  limit: res.data.limit,
                  count: res.data.count,
                  page: 1 + (res.data.skip / res.data.limit),
                  from: res.data.skip + 1,
                  to: (res.data.skip + res.data.limit > res.data.count) ? res.data.count : res.data.skip + res.data.limit
                }
              })
            }
          }, function(res) {
            if (res.status === 401) { // User is not logged in
              setToken(undefined);
            }
            
            reject(res.data != null ? res.data.errors : {});
          })
        });
      }

      // Impersonation
      // -------------
      // Setting the API token will override the session authentication (if any)
      var KEY_API_TOKEN = 'energimolnetApiToken';

      function getToken() {
        return $window.localStorage.getItem(KEY_API_TOKEN);;
      }

      function setToken(token) {
        if (token != null && token.length > 0) {
          $window.localStorage.setItem(KEY_API_TOKEN, token);
        } else {
          $window.localStorage.removeItem(KEY_API_TOKEN);
        }
      }

      // Pre-processing of request
      function _emAuthorize(config) {
        var token = getToken();

        if (token != null) {
          config.headers = {Authorization: 'OAuth ' + token}
        }

        return config;
      }

      return {
        getToken: getToken,
        setToken: setToken,
        request: request,
      };
    }
  ]);
};
