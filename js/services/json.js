define(['./module'], function (services) {
    'use strict';
    services.service('jsonData').factory('jsonData', function($window,$http,$q) {
      return {
        getItems: function (){
          return $q.all([
            $http.get('jsons/ActiveUsers.json'),
            $http.get('jsons/TotalUsers.json')
          ])
          .then(function(results) {
            var data = [];
            angular.forEach(results, function(result) {
              data = data.concat(result.data);
            });
            
            
            return data;
          });
        }
      };
    });
});



            
            