angular.module('mean.system')
  .controller('GameController', ['$scope', 'game', '$timeout', '$location', 'MakeAWishFactsService', '$http', '$dialog', ($scope, game, $timeout, $location, MakeAWishFactsService, $http, $dialog) => {
    $scope.hasPickedCards = false;
    $scope.winningCardPicked = false;
    $scope.showTable = false;
    $scope.modalShown = false;
    $scope.foundUsers = [];
    $scope.selectedUsers = [];
    $scope.game = game;
    $scope.pickedCards = [];
    let makeAWishFacts = MakeAWishFactsService.getMakeAWishFacts();
    $scope.makeAWishFact = makeAWishFacts.pop();

    $scope.pickCard = (card) => {
      if (!$scope.hasPickedCards) {
        if ($scope.pickedCards.indexOf(card.id) < 0) {
          $scope.pickedCards.push(card.id);
          if (game.curQuestion.numAnswers === 1) {
            $scope.sendPickedCards();
            $scope.hasPickedCards = true;
          } else if (game.curQuestion.numAnswers === 2 &&
            $scope.pickedCards.length === 2) {
            // delay and send
            $scope.hasPickedCards = true;
            $timeout($scope.sendPickedCards, 300);
          }
        } else {
          $scope.pickedCards.pop();
        }
      }
    };

    $scope.pointerCursorStyle = () => {
      if ($scope.isCzar() && $scope.game.state === 'waiting for czar to decide') {
        return { cursor: 'pointer' };
      }
      return {};
    };

    $scope.sendPickedCards = () => {
      game.pickCards($scope.pickedCards);
      $scope.showTable = true;
    };

    $scope.cardIsFirstSelected = (card) => {
      if (game.curQuestion.numAnswers > 1) {
        return card === $scope.pickedCards[0];
      }
      return false;
    };

    $scope.cardIsSecondSelected = (card) => {
      if (game.curQuestion.numAnswers > 1) {
        return card === $scope.pickedCards[1];
      }
      return false;
    };

    $scope.firstAnswer = ($index) => {
      if ($index % 2 === 0 && game.curQuestion.numAnswers > 1) {
        return true;
      }
      return false;
    };

    $scope.secondAnswer = ($index) => {
      if ($index % 2 === 1 && game.curQuestion.numAnswers > 1) {
        return true;
      }
      return false;
    };

    $scope.showFirst = card =>
      game.curQuestion.numAnswers > 1 && $scope.pickedCards[0] === card.id;


    $scope.showSecond = card =>
      game.curQuestion.numAnswers > 1 && $scope.pickedCards[1] === card.id;


    $scope.isCzar = () =>
      game.czar === game.playerIndex;

    $scope.isPlayer = $index =>
      $index === game.playerIndex;


    $scope.isCustomGame = () =>
      !(/^\d+$/).test(game.gameID) && game.state === 'awaiting players';


    $scope.isPremium = $index =>
      game.players[$index].premium;


    $scope.currentCzar = $index =>
      $index === game.czar;


    $scope.winningColor = ($index) => {
      if (game.winningCardPlayer !== -1 && $index === game.winningCard) {
        return $scope.colors[game.players[game.winningCardPlayer].color];
      }
      return '#f9f9f9';
    };

    $scope.pickWinning = (winningSet) => {
      if ($scope.isCzar()) {
        game.pickWinning(winningSet.card[0]);
        $scope.winningCardPicked = true;
      }
    };

    $scope.winnerPicked = () =>
      game.winningCard !== -1;


    $scope.startGame = () => {
      if (game.players.length < game.playerMinLimit) {
        const popupModal = $('#popupModal');
        const plural = (game.playerMinLimit - game.players.length) > 1 ? 's' : '';
        const popupText = `Not enough players, 
        expecting ${game.playerMinLimit - game.players.length}
        more player${plural}`;
        popupModal
          .find('.modal-body')
          .text(popupText);
        popupModal.modal('show');
      } else {
        game.startGame();
      }
    };
    $scope.invitePlayers = () => {
      if (game.players.length >= game.playerMaxLimit) {
        const popupModal = $('#popupModal');
        popupModal
          .find('.modal-body')
          .text('Too many players in game already');
        popupModal.modal('show');
      } else {
        $scope.searchUserText = '';
        const searchModal = $('#searchModal');
        searchModal.modal('show');
      }
    };

    $scope.quickSearchUsers = () => {
      const invitePlayersSearch = $scope.searchUserText;
      if (invitePlayersSearch.length >= 1) {
        $http({
          method: 'GET',
          url: `/api/search/users?q=${invitePlayersSearch}`
        }).then((searchResponse) => {
          $scope.foundUsers = searchResponse.data.result;
        });
      } else {
        $scope.foundUsers = [];
      }
    };

    $scope.abandonGame = () => {
      game.leaveGame();
      $location.path('/');
    };
    $scope.$watch('game.round', () => {
      $scope.hasPickedCards = false;
      $scope.showTable = false;
      $scope.winningCardPicked = false;
      $scope.makeAWishFact = makeAWishFacts.pop();
      if (!makeAWishFacts.length) {
        makeAWishFacts = MakeAWishFactsService.getMakeAWishFacts();
      }
      $scope.pickedCards = [];
    });

    // In case player doesn't pick a card in time, show the table
    $scope.$watch('game.state', () => {
      if (game.state === 'waiting for czar to decide' && $scope.showTable === false) {
        $scope.showTable = true;
      }
    });

    $scope.$watch('game.gameID', () => {
      if (game.gameID && game.state === 'awaiting players') {
        if (!$scope.isCustomGame() && $location.search().game) {
          // If the player didn't successfully enter the request room,
          // reset the URL so they don't think they're in the requested room.
          $location.search({});
        } else if ($scope.isCustomGame() && !$location.search().game) {
          // Once the game ID is set, update the URL if this is a game with friends,
          // where the link is meant to be shared.
          $location.search({ game: game.gameID });
          if (!$scope.modalShown) {
            setTimeout(() => {
              const link = document.URL;
              const txt = 'Give the following link to your friends so they can join your game: ';
              $('#lobby-how-to-play').text(txt);
              $('#oh-el').css({ 'text-align': 'center', 'font-size': '22px', 'background': 'white', 'color': 'black' }).text(link);
            }, 200);
            $scope.modalShown = true;
          }
        }
      }
    });

    if ($location.search().game && !(/^\d+$/).test($location.search().game)) {
      console.log('joining custom game');
      game.joinGame('joinGame', $location.search().game);
    } else if ($location.search().custom) {
      game.joinGame('joinGame', null, true);
    } else {
      game.joinGame();
    }
  }]);
