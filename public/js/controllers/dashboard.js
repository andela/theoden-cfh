angular.module('mean.system')
  .controller('DashboardController', ['$scope', 'Global', '$http', ($scope, Global, $http) => {
    $scope.donationData = {};
    $scope.gameLogData = {};
    $scope.leaderBoardData = {};
    $scope.donations = false;
    $scope.leaderboard = false;
    $scope.gameLog = true;
    $scope.noDonations = false;
    $scope.noGames = false;
    angular.element('#games').addClass('active');


    $scope.getDonations = (token) => {
      token = localStorage.getItem('token');
      $http.get(`/api/donations/${token}`).then((response) => {
        $scope.donationData = (response.data);
      });
    };

    $scope.getLeaderboard = () => {
      $http.get('/api/leaderboard').then((response) => {
        $scope.leaderboardData = (response.data);
      });
    };
    $scope.getGameLogs = (token) => {
      token = localStorage.getItem('token');
      $http.get(`/api/games/history/${token}`).then((response) => {
        $scope.gameLogData = (response.data);
      });
    };
    $scope.showDonations = () => {
      angular.element('#games').removeClass('active');
      angular.element('#donations').addClass('active');
      angular.element('#leaderboard').removeClass('active');
      if ($scope.donationData.length === 0) {
        $scope.noDonations = true;
        $scope.noGames = false;
        $scope.donations = false;
        $scope.leaderboard = false;
        $scope.gameLog = false;
      } else {
        $scope.donations = true;
        $scope.leaderboard = false;
        $scope.gameLog = false;
      }
    };

    $scope.showGames = () => {
      angular.element('#games').addClass('active');
      angular.element('#donations').removeClass('active');
      angular.element('#leaderboard').removeClass('active');
      if ($scope.gameLogData.length === 0) {
        $scope.noGames = true;
        $scope.noDonations = false;
        $scope.gameLog = false;
        $scope.donations = false;
        $scope.leaderboard = false;
      } else {
        $scope.noDonations = false;
        $scope.gameLog = true;
        $scope.donations = false;
        $scope.leaderboard = false;
      }
    };

    $scope.showLeaderBoard = () => {
      angular.element('#games').removeClass('active');
      angular.element('#donations').removeClass('active');
      angular.element('#leaderboard').addClass('active');

      $scope.noDonations = false;
      $scope.noGames = false;
      $scope.leaderboard = true;
      $scope.donations = false;
      $scope.gameLog = false;
    };
    $scope.getDonations();

    $scope.getGameLogs();
    $scope.getLeaderboard();
  }]);
