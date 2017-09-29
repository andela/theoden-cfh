angular.module('mean.system')
  .controller('IndexController', ['$scope', 'Global', '$location', 'socket', 'game', 'AvatarService', ($scope, Global, $location, socket, game, AvatarService) => {
    $scope.global = Global;
    $scope.playAsGuest = () => {
      game.joinGame();
      $location.path('/app');
    };

    $scope.showError = () => {
      if ($location.search().error) {
        return $location.search().error;
      } 
      else {
        return false;

    $scope.avatars = [];
    AvatarService.getAvatars()
      .then((data) => {
        $scope.avatars = data;
      });
    $scope.playGame = () => {
      swal({
        title: 'Start a new game session',
        text: 'Are you sure you want to start?',
        type: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Go back',
        confirmButtonText: 'Start Game'
      }).then(() => {
        $http({
          method: 'GET',
          url: '/play'
        }).then(() => {
          $location.path('/app');
        });
      });
    };
  }]);
