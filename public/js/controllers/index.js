angular.module('mean.system')
  .controller('IndexController', ['$scope', 'Global', '$cookieStore',
    '$cookies', '$location', '$http', '$window', 'socket', 'game', 'AvatarService',
    function ($scope, Global, $cookieStore, $cookies, $location, $http,
      $window, socket, game, AvatarService) {
      $scope.checkAuth = () => {
        if ($cookies.token) {
          $window.localStorage.setItem('token', $cookies.token);
        }
      };

      $scope.global = Global;
      $scope.formData = {};
      $scope.checkAuth();

      $scope.playAsGuest = function () {
        game.joinGame();
        $location.path('/app');
      };

      $scope.showError = function () {
        if ($location.search().error) {
          return $location.search().error;
        }
        return false;
      };

      $scope.signIn = () => {
        $http.post('api/auth/signin', JSON.stringify($scope.formData))
          .success((data) => {
            if (data.success === true) {
              $window.localStorage.setItem('token', data.token);
              $location.path('/');
              $window.location.reload();
            } else {
              $scope.showMessage = data.message;
            }
          }).error(() => {
            $scope.showMessage = 'Wrong email or password';
          });
      };


      $scope.signUp = () => {
        $http.post('api/auth/signup', JSON.stringify($scope.formData))
          .success((data) => {
            if (data.success === true) {
              $window.localStorage.setItem('token', data.token);
              $location.path('/#!/');
            } else {
              $scope.showMessage = data.message;
            }
          }).error((error) => {
            $scope.showMessage = `${error.message}`;
          });
      };


      $scope.signout = () => {
        $http.get('/signout').success(() => {
          angular.forEach($cookies, (v, k) => {
            $cookieStore.remove(k);
          });
          $window.localStorage.removeItem('token');

          $location.path('/');
          $window.location.reload();
        });
      };


      $scope.avatars = [];
      AvatarService.getAvatars()
        .then((data) => {
          $scope.avatars = data;
        });
    }]);
