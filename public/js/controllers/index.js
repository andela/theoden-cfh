angular
  .module('mean.system')
  .controller('IndexController', [
    '$scope',
    'Global',
    '$location',
    '$window',
    'socket',
    'game',
    'AvatarService',
    '$http',
    ($scope, Global, $location, $window, socket, game, AvatarService, $http) => {
      $scope.global = Global;
      $scope.formData = {};

      $scope.playAsGuest = () => {
        game.joinGame();
        $location.path('/app');
      };

      $scope.showError = () => {
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
              // $window.localStorage.setItem('credentials', data.credentials);
              $location.path('/#!/');
              // $window.location.reload();
            } else {
              $scope.showMessage = data.message;
            }
          }).error((error) => {
            $scope.showMessage = `${error.message}`;
          });
      };


      $scope.signout = () => {
        $window.localStorage.removeItem('token');
        $location.path('/');
        $window.location.reload();
      };

      $scope.showRegion = () => {
        const myModal = $('#select-region');
        myModal.modal('open');
      };

      $scope.showRegionGuest = () => {
        const myModal = $('#select-region-guest');
        myModal.modal('open');
      };
  

      $scope.playAsGuest = () => {
        game.joinGame();
        $location.path('/app');
      };
      
      $scope.playWithStrangers = ()=> {
        if ($scope.region === undefined) {
          console.log(`what region: ${$scope.region}`);
          alert('Please Select your Region');
          return;
        }
       
        alert("Region selected");
        $scope.data = { player_region: $scope.region };

        $http.post('/setregion', $scope.data)
          .success((data) => {
            console.log(data);
          });
        const myModal = $('#select-region');
        myModal.modal('close');
        $window.location.href = '/play';
      };

      $scope.playWithFriends = () => {
        if ($scope.region === undefined) {
          alert('Please Select your Region');
          return;
        }

        $scope.data = { player_region: $scope.region };
        $http.post('/setregion', $scope.data)
          .success((data) => {
            console.log(data);
          });
        const myModal = $('#select-region');
        myModal.modal('open');
        $window.location.href = '/play?custom';
      };

      $scope.showError = () => {
        if ($location.search().error) {
          return $location
            .search()
            .error;
        } else {
          return false;
        }
      };

      $scope.avatars = [];
      AvatarService
        .getAvatars()
        .then((data) => {
          $scope.avatars = data;
        });
        
      $scope.enterGame = () => {
        const gameModal = $('#modal1');
        gameModal
          .modal('close');
        $http({ method: 'GET', url: '/play' }).then(() => {
          $location.path('/app');
          $window.location.reload();
        });
      };
      $scope.playGame = () => {
        const gameModal = $('#modal1');
        gameModal
          .modal('open');
      };
    }
  ]);
