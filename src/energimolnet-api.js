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
 *   energimolnetAPI.request({url: '/owners', params:...})
 */
var makeUrl = require('./util/makeurl');

var PATH_API_VERSION =        'api/2.0';
var EVENT_LOGIN_NEEDED =      'em:loginNeeded';

module.exports = function($http, $q, $rootScope, Auth, BASE_URL) {
  function request(config) {
    return $q(function(resolve, reject) {
      config.url = makeUrl([BASE_URL, PATH_API_VERSION, config.url]);

      Auth.authorize(config).then(function(config) {
        $http(config).then(function(res) {
          resolve(parseResponse(res));
        }, function(res) {
          if (res.status === 401) {
            // Reset private token if it existed
            if (Auth.getPrivateToken()) {
              Auth.setPrivateToken(null);
              // TODO: Retry request
              loginNeeded();
            } else {
              loginNeeded();
            }
          }

          reject(res.data ? res.data.errors : {});
        });
      }, function() {
        loginNeeded();
        reject({});
      });
    });
  }

  function loginNeeded() {
    $rootScope.$broadcast(EVENT_LOGIN_NEEDED);
  }

  function parseResponse(res) {
    if (res.data.count == null || res.data.limit == null || res.data.skip == null) {
      return res.data.data;
    } else {
      return {
        data: res.data.data,
        pagination: {
          skip: res.data.skip,
          limit: res.data.limit,
          count: res.data.count,
          page: 1 + (res.data.skip / res.data.limit),
          from: (res.data.count === 0) ? 0 : res.data.skip + 1,
          to: (res.data.skip + res.data.limit > res.data.count) ? res.data.count : res.data.skip + res.data.limit
        }
      };
    }
  }

  return {
    request: request
  };
};
