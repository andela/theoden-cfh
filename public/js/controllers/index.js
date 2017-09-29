angular
  .module('mean.system')
  .controller('IndexController', [
    '$scope',
    'Global',
    '$location',
    'socket',
    'game',
    'AvatarService',
    '$http',
    ($scope, Global, $location, socket, game, AvatarService, $http) => {
      $scope.global = Global;
      $scope.playAsGuest = () => {
        game.joinGame();
        $location.path('/app');
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
        $http({ method: 'GET', url: '/play' }).then(() => {
          $location.path('/app');
        });
      };
      $scope.playGame = () => {
        const gameModal = $('#modal1');
        // // gameModal // find('.modal-b') // .text('Something');
        gameModal
          .modal('show');
      };
    }
  ]);
