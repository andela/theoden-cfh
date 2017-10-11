/* global introJs */
angular.module('mean.system')
  .controller('TourController', ['$scope', '$window', '$timeout', ($scope, $window, $timeout) => {
    $scope.introJs = introJs();
    $scope.$on('$locationChangeSuccess', () => {
      if ($scope.introJs) {
        $scope.introJs.exit();
      }
    });

    $scope.showChat = true;
    $scope.messages = [];
    $scope.chatOpenClose = 'expand_more';
    $scope.showTime = true;
    $scope.awaitingPlayers = true;
    $scope.showStartGame = true;
    $scope.showQuestion = false;
    $scope.showInfo = true;
    $scope.showCards = false;
    $scope.showAnswers = false;
    $scope.winnerPicked = false;
    $scope.gameEnded = false;
    $scope.gameWon = false;
    $scope.colors = ['yellow', 'green', 'red'];

    $scope.game = {
      time: 0,
      pointLimit: 5,
      playerIndex: 0,
      czar: -1,
      players: [
        {
          username: 'Silver Dreams',
          points: 0,
          avatar: '../img/chosen/FD04.png',
          color: 0
        },
        {
          username: 'Fidelisto',
          points: 0,
          avatar: '../img/chosen/J01.png'
        },
        {
          username: 'Aimee',
          points: 0,
          avatar: '../img/chosen/FH03.png',
        },
        {
          username: 'Markus',
          points: 0,
          avatar: '../img/chosen/F01.png'
        },
        {
          username: 'Codebeast',
          points: 0,
          avatar: '../img/chosen/N03.png'
        }
      ],
      playerMaxLimit: 12,
      curQuestion: {
        text: 'The best way to catch a lasgidi rat is ___________'
      }
    };

    $scope.isPlayer = $index =>
      $index === $scope.game.playerIndex;

    $scope.isPremium = $index =>
      $scope.game.players[$index].premium;

    $scope.currentCzar = $index =>
      $index === $scope.game.czar;

    $scope.introJs.setOptions({
      showBullets: false,
      exitOnOverlayClick: false,
      steps: [{
        intro: 'Welcome to <span id=introjs-cfh><strong>Cards for Humanity.</strong></span> <br /> You can move to the previous or next slide in this tour by clicking <em>Back</em> or <em>Next</em>, or by navigating with your arrow keys. <br /> To exit the tour at any time, click <em>skip.</em>'
      },
      {
        element: '#finding-players',
        intro: 'This shows that the game has not started and more players can still join the game.'
      },
      {
        element: '#player-count-container',
        intro: 'This shows the number of players who have joined the game, and the maximum number that can join.',
        position: 'right'
      },
      {
        element: '#invite-players-button',
        intro: 'Here, you can invite other players to join you in the game.'
      },
      {
        element: '#social-bar-container',
        intro: 'These represent the players who have joined the game.',
        position: 'left'
      },
      {
        element: '#player-star',
        intro: 'Together with the color on your player bar, this icon helps you identify yourself on the players list.'
      },
      {
        element: '#chat',
        intro: 'You can chat with other players in the current game here'
      },
      {
        element: '#toggle-chat',
        intro: 'The chat window is retractable. Click here to minimize or maximize the chat window'
      },
      {
        element: '#chat-notif',
        intro: 'When the chat window is minimized, you are notified of unread chat messages here'
      },
      {
        element: '#start-game',
        intro: 'Once the minimum required players have joined, you or any other user can start the game by clicking here.'
      },
      {
        element: '#question',
        intro: 'Once a game is started and the CZAR draws a card, a question is displayed here.'
      },
      {
        element: '#answers',
        intro: 'You have different answer cards to pick what you deem the most appropriate answer to the question. Some questions require you to pick multiple cards.',
        position: 'top'
      },
      {
        element: '#timer-container',
        intro: 'This shows how many seconds you have to choose an answer to the current question. After time out, CZAR then selects a favorite answer. whoever submitted the CZAR\'s favorite answer wins the round.',
      },
      {
        element: '#czar-container',
        intro: 'This icon shows who is currently the CZAR. As a CZAR, you wait for all players to submit their answers and then you select your favorite answer.'
      },
      {
        element: '#player-score',
        intro: 'This is your current score. It shows the number of rounds you have won. The first player to win 5 rounds wins the game.'
      },
      {
        element: '#abandon-game-button',
        intro: 'You can click this icon to abandon a game at any time, but then, that is for the faint-hearted. Finish each game, like a boss!'
      },
      {
        element: '#inner-text-container',
        intro: 'When the game ends, you can join a new a game or return to Lobby.',
        position: 'top'
      },
      {
        element: '#charity-widget-container',
        intro: 'No better way to celebrate your win or \'near-win\' than to help those in need. Click here to donate to charity at the end of the game.',
        position: 'top'
      },
      {
        intro: 'Now you are ready to boss the world! Click <strong>done</strong> to finish the tour',
        position: 'bottom'
      }]
    });

    const populateScores = () => {
      $scope.game.players[0].points = 4;
      $scope.game.players[1].points = 1;
      $scope.game.players[2].points = 3;
      $scope.game.players[3].points = 2;
      $scope.game.players[4].points = 0;
    };

    const resetScores = () => {
      $scope.game.players[0].points = 0;
      $scope.game.players[1].points = 0;
      $scope.game.players[2].points = 0;
      $scope.game.players[3].points = 0;
      $scope.game.players[4].points = 0;
    };

    const messages = [
      {
        sender: 'Fidelisto',
        message: 'Chill, I\'m winning the next round',
        timeSent: new Date(Date.now() - 36000).toLocaleTimeString({
          hour12: true
        }),
        avatarUrl: '../img/chosen/J01.png'
      },
      {
        sender: 'Aimee',
        message: 'In your dreams',
        timeSent: new Date(Date.now() - 24000).toLocaleTimeString({
          hour12: true
        }),
        avatarUrl: '../img/chosen/FH03.png'
      },
      {
        sender: 'Markus',
        message: 'Osheeeey!',
        timeSent: new Date(Date.now()).toLocaleTimeString({
          hour12: true
        }),
        avatarUrl: '../img/chosen/F01.png'
      }
    ];

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
              $scope.showOtherPlayers = true;
              $scope.showCards = false;
              $scope.showChat = true;
            });
            break;
          }
        case 'toggle-chat':
          {
            $scope.$apply(() => {
              $scope.showChat = true;
              $scope.showChatNotif = false;
            });
            break;
          }
        case 'chat-notif':
          {
            $scope.$apply(() => {
              $scope.showChat = false;
              $scope.showChatNotif = true;
              $scope.chatNotifs = 3;
              $scope.messages = [];
            });
            break;
          }
        case 'start-game':
          {
            $scope.$apply(() => {
              $scope.awaitingPlayers = true;
              $scope.showQuestion = false;
              $scope.showCards = false;
              $scope.showChat = true;
              $scope.showChatNotif = false;
              $scope.messages = messages;
              $scope.game.czar = -1;
            });
            break;
          }
        case 'question':
          {
            $scope.$apply(() => {
              $scope.awaitingPlayers = false;
              $scope.showQuestion = true;
              $scope.showCards = true;
              $scope.gameEnded = false;
              $scope.game.czar = 0;
            });
            break;
          }
        case 'cards':
          {
            $scope.$apply(() => {
              $scope.game.time = 0;
            });
            break;
          }
        case 'timer-container':
          {
            $scope.$apply(() => {
              $scope.game.time = 17;
            });
            break;
          }
        case 'czar-container':
          {
            $scope.$apply(() => {
              resetScores();
            });
            break;
          }
        case 'player-score':
          {
            populateScores();
          }
        case 'abandon-game-button':
          {
            $scope.$apply(() => {
              $scope.game.players[0].points = 4;
              $scope.showQuestion = true;
              $scope.showStartButton = false;
              $scope.showCards = true;
              $scope.gameEnded = false;
            });
            break;
          }
        case 'inner-text-container':
          {
            $scope.$apply(() => {
              populateScores();
              $scope.game.players[0].points = 5;
              $scope.game.players[2].points = 4;
              $scope.showQuestion = false;
              $scope.showCards = false;
              $scope.gameEnded = true;
            });
            break;
          }
        case 'charity-game-widget':
          {
            $scope.$apply(() => {
              $scope.showQuestion = false;
              $scope.showCards = false;
            });
            break;
          }
        default:
          {
            break;
          }
      }
    };

    $scope.cards = [
      {
        text: 'Let ASUU strike it'
      },
      {
        text: 'Army-standard slap'
      },
      {
        text: 'Edible underpants'
      },
      {
        text: 'Go gaga Lady Gaga style'
      },
      {
        text: 'The forbidden fruit.'
      },
      {
        text: 'Passive-aggressive Post-it notes.'
      },
      {
        text: 'Unfathomable stupidity.'
      },
      {
        text: 'Genetically engineered super-soldiers'
      },
      {
        text: 'Statistically validated stereotypes.'
      },
      {
        text: 'Licking things to claim them as your own.'
      }
    ];

    setTimeout(() => $scope.introJs.start()
      .oncomplete(tourComplete)
      .onexit(tourComplete)
      .onbeforechange(beforeTourChange), 500);
  }]);
