angular.module('mean.system')
  .controller('TourController', ['$scope', ($scope) => {
    $scope.introJs = introJs();
    $scope.CompletedEvent = () => {
      console.log('Completed Event called');
    };

    $scope.ExitEvent = () => {
      console.log("Exit Event called");
    };

    $scope.ChangeEvent = (targetElement) => {
      console.log("Change Event called");
      console.log(targetElement);
    };

    $scope.BeforeChangeEvent = (targetElement) => {
      console.log('Before Change Event called');
      console.log(targetElement);
    };

    $scope.AfterChangeEvent = (targetElement) => {
      console.log('After Change Event called');
      console.log(targetElement);
    };

    $scope.playerCount = 1;
    $scope.playerScore = 0;
    $scope.awaitingPlayers = true;

    $scope.introJs.setOptions({
      steps: [
        {
          intro: `Welcome to Cards for Humanity. <br />
                  A game where you can totally be your awkward self and still get a shot at healing the world. <br /> 
                  If you like, I could give you a tour to get you up to speed with
                  playing the game. <br />
                  While you're having fun,
                  please don't forget to make a donation. <br />
                  When you're ready, click the next button to start the tour <br />
                  To exit this tour at any time, click <em>skip</em>`
        },
        {
          element: '#player-count-container',
          intro: 'This is the number of current available players and the maximum number of players that can play the game. You need a minimum of three (3) players to start the game, and you cannot be more than 12'
        },
        {
          element: '#start-game',
          intro: 'When the minimum number of players is reached, a start game button will be shown in this container. Any player can click on the button to start the game.'
        },
        {
          element: '#question',
          intro: 'This is where the question appears after the CZAR clicks the deck. There is limited time for each one to pick an answer to the question'
        },
        {
          element: '#cards',
          intro: `Different cards containing answers to the questions will appear here. Select the
                  cards(s) you think best answers the question`,
          position: 'down'
        },
        {
          element: '#inner-timer-container',
          intro: `This countdown timer shows you how much time you have left to pick
                  a card. (both as a player and as a czar)`
        },
        {
          element: '#player-score',
          intro: `This is each player's score. First player to reach 
                  five (5) wins the game.`
        },
        {
          element: '#abandon-game-button',
          intro: `You can leave the game any time by clicking on the abandon
                  game button. Well, I hope you don't`
        },
        {
          intro: `Thank you for taking the tour. Please remember to make a donation.
                  All donations go to the Make a Wish foundation. <br />
                  To begin the game, click <em>Done</em>`
        },
      ]
    });

    $scope.CallMe = setTimeout(() => {
      $scope.introJs.start();
    }, 300);
  }]);
