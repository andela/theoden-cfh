/* global introJs */
angular.module('mean.system')
  .controller('TourController', ['$scope', '$window', ($scope, $window) => {
    $scope.$on('$locationChangeSuccess', () => {
      if ($scope.gameTour) {
        $scope.gameTour.exit();
      }
    });

    $scope.introJs = introJs();
    $scope.playerCount = 1;
    $scope.playerScore = 0;
    $scope.awaitingPlayers = true;
    $scope.introJs.setOptions({
      showBullets: true,
      exitOnOverlayClick: false,
      steps: [{
        intro: 'Welcome to the game <span id=introjs-cfh><strong>Cards for Humanity.</strong></span> This is a brief tour to help you get started.<br /> To move to the next slide, click <em>Next</em>. You can also navigate with your direction keys <br /> To exit this tour at any time, click <em>skip.</em>'
      },
      {
        element: '#finding-players',
        intro: 'Game needs a minimum of 3 players to start. You would have to wait for the minimum number of players to join the game before you can start.'
      },
      {
        element: '#player-count-container',
        intro: 'This shows the number of players who have joined the game, and the maximum number that can join.',
        position: 'right'
      },
      {
        element: '#social-bar-container',
        intro: 'These represent the players who have joined the game.',
        position: 'left'
      },
      {
        element: '#player-star',
        intro: 'This icon helps you identify yourself on the players list. This is especially helpful when you are playing as guest, with a random name.'
      },
      {
        element: '#player-score',
        intro: 'This is your current score. It shows the number of rounds you have won. The first player to win 5 rounds wins the game.'
      },
      {
        element: '#king',
        intro: 'When you donate, your avatar gets decorated this lovely crown.'
      },
      {
        element: '#start-game',
        intro: 'Once the minimum required players have joined, you or any other user can start the game by clicking on the start game button. You could still wait to have the number you want.'
      },
      {
        element: '#invite-player',
        intro: 'Here, you can invite other players to join you in the game.'
      },
      {
        element: '#question',
        intro: 'Once a game is started and the CZAR shuffles the deck, a question is displayed here.'
      },
      {
        element: '#cards',
        intro: 'You have different answer cards to pick what you deem the most appropriate answer to the question. Some questions require you to pick multiple cards.',
        position: 'top'
      },
      {
        element: '#inner-timer-container',
        intro: 'This shows how much time you have to choose an answer to the current question. After time out, CZAR then selects a favorite answer. whoever submitted the CZAR\'s favorite answer wins the round.'
      },
      {
        element: '#the-czar',
        intro: 'This icon shows who is currently the CZAR. As a Czar, you wait for all players to submit their answers and then you select your favorite answer.'
      },
      {
        element: '#inner-text-container',
        intro: 'When the game ends, you can join a new a game or return to Lobby.',
        position: 'top'
      },
      {
        element: '#charity-widget-container',
        intro: 'No better way to celebrate your win or a \'near-win\' than to help those in need. Click here to donate to charity at the end of the game.',
        position: 'top'
      },
      {
        element: '#abandon-game-button',
        intro: 'You can click this icon to abandon a game at any time. I hope you never have to. Finish each game, like a boss!'
      },
      {
        element: '#home',
        intro: 'Now you are ready to boss the world! Click <strong>done</strong> to continue to play the game',
        position: 'bottom'
      }]
    });

    const isGameCustom = () => {
      const custom = $window.location.href.indexOf('custom') >= 0;
      return (custom);
    };

    const tourComplete = () => {
      if (isGameCustom()) {
        $window.location = '/app?custom';
      } else {
        $window.location = '#!/';
      }
    };

    const beforeTourChange = (targetElement) => {
      switch (targetElement.id) {
        case 'finding-players':
          {
            $scope.$apply(() => {
              $scope.awaitingPlayers = true;
            });
            break;
          }
        case 'player-count-container':
          {
            $scope.$apply(() => {
              $scope.awaitingPlayers = true;
              $scope.showOtherPlayers = true;
              $scope.showStartButton = false;
            });
            break;
          }
        case 'social-bar-container':
          {
            $scope.$apply(() => {
              $scope.awaitingPlayers = true;
              $scope.showOtherPlayers = true;
              $scope.showStartButton = false;
            });
            break;
          }
        case 'player-star':
          {
            $scope.$apply(() => {
              $scope.awaitingPlayers = true;
              $scope.showOtherPlayers = true;
              $scope.showStartButton = false;
            });
            break;
          }
        case 'player-score':
          {
            $scope.$apply(() => {
              $scope.awaitingPlayers = true;
              $scope.showOtherPlayers = true;
              $scope.showStartButton = false;
            });
            break;
          }
        case 'king':
          {
            $scope.$apply(() => {
              $scope.awaitingPlayers = true;
              $scope.showOtherPlayers = true;
              $scope.showStartButton = false;
            });
            break;
          }
        case 'start-game':
          {
            $scope.$apply(() => {
              $scope.awaitingPlayers = false;
              $scope.showOtherPlayers = true;
              $scope.showStartButton = true;
              $scope.showTime = false;
              $scope.showQuestion = false;
            });
            break;
          }
        case 'invite-player':
          {
            $scope.$apply(() => {
              $scope.awaitingPlayers = false;
              $scope.showOtherPlayers = true;
              $scope.showStartButton = true;
              $scope.showTime = false;
              $scope.showQuestion = false;
              $scope.showInviteButton = true;
            });
            break;
          }
        case 'question':
          {
            $scope.$apply(() => {
              $scope.showStartButton = false;
              $scope.showTime = true;
              $scope.showQuestion = true;
            });
            break;
          }
        case 'cards':
          {
            $scope.$apply(() => {
              $scope.showCzar = false;
            });
            break;
          }
        case 'time-card':
          {
            $scope.$apply(() => {
              $scope.showQuestion = true;
              $scope.gameEnd = false;
              $scope.playerScore = 0;
            });
            break;
          }
        case 'the-czar':
          {
            $scope.$apply(() => {
              $scope.showCzar = true;
              $scope.playerScore = 1;
            });
            break;
          }
        case 'inner-text-container':
          {
            $scope.$apply(() => {
              $scope.showQuestion = false;
              $scope.gameEnd = true;
              $scope.showChatBody = false;
            });
            break;
          }
        case 'chat':
          {
            $scope.$apply(() => {
              $scope.showChatBody = true;
            });
            break;
          }
        case 'requests':
          {
            $scope.$apply(() => {
              $scope.showChatBody = false;
            });
            break;
          }
        default:
          {
            break;
          }
      }
    };

    setTimeout(() => $scope.introJs.start()
      .oncomplete(tourComplete)
      .onexit(tourComplete)
      .onbeforechange(beforeTourChange), 500);
  }]);
