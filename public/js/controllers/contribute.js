angular.module('mean.system')
  .controller('contributeController', ['$scope', '$http', '$location', ($scope, $http, $location) => {
    $scope.text = '';
    const token = localStorage.getItem('token');

    if (!token) {
      $location.path('/signin');
    }

    $scope.setHttpHeader = () => {
      $http.defaults.headers.common.Authorization = token;
    };

    $scope.setHttpHeader();

    // $scope.setAuth();

    const successCallback = (response) => {
      /* eslint-disable */
      Materialize.toast(response.data.message, 4000);
      /* eslint-enable */
      $scope.text = '';
      if ($scope.type === 'question') {
        $scope.numAnswers = '';
      }
    };

    const errorCallback = (reason) => {
      $scope.error = reason.data.errors;
    };

    $scope.type = 'question';

    const addQuestion = () => {
      $http.post('/questions', { text: $scope.text, numAnswers: $scope.numAnswers
      }).then(successCallback, errorCallback);
    };

    const addAnswer = () => {
      $http.post('/answers', { text: $scope.text })
        .then(successCallback, errorCallback);
    };

    $scope.submitForm = () => {
      $scope.setHttpHeader();
      $scope.error = null;
      if ($scope.type === 'question') {
        return addQuestion($scope.question);
      }

      return addAnswer($scope.answer);
    };
  }]);
