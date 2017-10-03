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

      $scope.showRegion = () => {
        const myModal = $('#select-region');
        myModal.modal('show');
      };

      $scope.showRegionGuest = () => {
        const myModal = $('#select-region-guest');
        myModal.modal('show');
      };
  

      $scope.playAsGuest = () => {
        game.joinGame();
        $location.path('/app');
      };
      
      $scope.playWithStrangers = ()=> {
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
        myModal.modal('hide');
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
        myModal.modal('hide');
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
        console.log('here');
        const gameModal = $('#modal1');
        gameModal
          .modal('hide');
        $http({ method: 'GET', url: '/play' }).then(() => {
          $location.path('/app');
          $window.location.reload();
         
        });
      };
      $scope.playGame = () => {
        const gameModal = $('#modal1');
        gameModal
          .modal('show');
      };
    }
  ]);
