angular.module('mean.system')
  .controller('GameController', ['$scope', 'game', '$timeout', '$location', 'MakeAWishFactsService', '$http', '$dialog', ($scope, game, $timeout, $location, MakeAWishFactsService, $http, $dialog) => {
    $scope.hasPickedCards = false;
    $scope.winningCardPicked = false;
    $scope.showTable = false;
    $scope.modalShown = false;
    $scope.foundUsers = [];
    $scope.selectedUsers = [];
    $scope.selectedUsersID = [];
    $scope.friendsList = [];
    $scope.usersInGame = [];
    $scope.game = game;
    $scope.boolTab = false;
    $scope.pickedCards = [];
    let makeAWishFacts = MakeAWishFactsService.getMakeAWishFacts();
    $scope.makeAWishFact = makeAWishFacts.pop();
    $scope.shownoCzar = false;

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
    $scope.removeFriendClick = (friendInfo) => {
      const userToken = window.localStorage.token;
      game
        .friendsList
        .splice(game
          .friendsList
          .indexOf(friendInfo._id), 1); // eslint-disable-line no-underscore-dangle
      $http({
        method: 'PUT',
        url: `/api/users/${userToken}/friends?friendID=${friendInfo._id}` // eslint-disable-line no-underscore-dangle
      }).then((returnObject) => {
        $scope.findFriendNames();
      });
    };
    $scope.inviteSelectedPlayers = (mod) => {
      game.inviteSelectedPlayers(
        {
          selectedUsers: (mod === 'friends') ?
            $scope.friendsList
            : $scope.selectedUsersID,
          gameID: game.gameID,
          gameURL: document.URL,
          inviteName: game.players[game.playerIndex].username
        });
      $scope.closeClearModal();
    };

    $scope.invitePlayersClick = (users) => {
      $scope.selectedUsersID.push(users._id); // eslint-disable-line no-underscore-dangle
      $scope.selectedUsers.push(users);
      $scope.foundUsers.splice($scope.foundUsers.indexOf(users), 1);
    };

    $scope.addNewFriend = (users) => {
      const token = window.localStorage.token;
      $http({
        method: 'GET',
        url: `/api/users/friends?id=${users._id}&token=${token}` // eslint-disable-line no-underscore-dangle
      }).then((searchResponse) => {
        $scope.foundUsers[$scope.foundUsers.indexOf(users)].isFriend = true;
        game.updateFriendList(users._id); // eslint-disable-line no-underscore-dangle
      });
    };
    $scope.findFriendNames = () => {
      $scope.boolTab = true;
      const friendIdList = game.friendsList;
      $scope.foundFriends = [];
      $scope.foundUsers = [];
      $scope.searchUserText = '';

      if (friendIdList.length >= 1) {
        $http({
          method: 'GET',
          url: `/api/search/friends?iDs=${friendIdList}`
        }).then((searchResponse) => {
          if (searchResponse) {
            $scope.foundFriends = [];
            searchResponse.data.result.forEach((friends, index) => {
              if ($scope.usersInGame
                .indexOf(friends._id) === -1 // eslint-disable-line no-underscore-dangle
              ) {
                friends.isOnline = false;

                if (game.usersOnline
                  .indexOf(friends._id) !== -1) { // eslint-disable-line no-underscore-dangle
                  friends.isOnline = true;
                }
                $scope.foundFriends.push(friends);
              }
            });
          }
        });
      }
    };
    $scope.closeClearModal = () => {
      $scope.foundUsers = [];
      $scope.selectedUsers = [];
      $scope.selectedUsersID = [];
      $('#searchModal').modal('close');
    };
    $scope.removeInvitePlayersClick = (users) => {
      $scope
        .selectedUsersID
        .splice($scope.selectedUsersID
          .indexOf(users._id), 1); // eslint-disable-line no-underscore-dangle
      $scope.selectedUsers.splice($scope.selectedUsers.indexOf(users, 1));
    };

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
        popupModal.modal('open');
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
        $('#popupModal').modal('open');
      } else {
        $scope.foundUsers = [];
        $scope.friendsList = [];
        $scope.selectedUsers = [];
        $scope.selectedUsersID = [];
        $scope.searchUserText = '';
        const searchModal = $('#searchModal');
        $scope.friendsList = game.friendsList;
        searchModal.modal('open');
      }
    };

    $scope.quickSearchUsers = () => {
      const invitePlayersSearch = $scope.searchUserText;
      if (invitePlayersSearch.length >= 1) {
        $http({
          method: 'GET',
          url: `/api/search/users?q=${invitePlayersSearch}`
        }).then((searchResponse) => {
          $scope.foundUsers = [];
          searchResponse.data.result.forEach((users, index) => {
            if ($scope.usersInGame
              .indexOf(users._id) === -1 // eslint-disable-line no-underscore-dangle
              && $scope.selectedUsersID
                .indexOf(users._id) === -1 // eslint-disable-line no-underscore-dangle
            ) {
              users.isOnline = false;
              users.isFriend = false;

              if (game.usersOnline
                .indexOf(users._id) !== -1) { // eslint-disable-line no-underscore-dangle
                users.isOnline = true;
              }
              if (game.friendsList
                .indexOf(users._id) !== -1) { // eslint-disable-line no-underscore-dangle
                users.isFriend = true;
              }
              $scope.foundUsers.push(users);
            }
          });
        });
      } else {
        $scope.foundUsers = [];
      }
    };

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
          const popupText = `Not enough players, expecting ${game.playerMinLimit - game.players.length}
          more player${plural}`;
          popupModal
            .find('.modal-body')
            .text(popupText);
          popupModal.modal('open');
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
          popupModal.modal('open');
        } else {
          $scope.searchUserText = '';
          const searchModal = $('#searchModal');
          searchModal.modal('open');
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

      $scope.shuffleCards = () => {
        const card = $(`#${event.target.id}`);
        card.addClass('animated flipOutY');
        setTimeout(() => {
          $scope.startNextRound();
          card.removeClass('animated flipOutY');
          $('#shuffleModal').modal('close');
        }, 500);
      };
      $scope.startNextRound = () => {
        if ($scope.isCzar()) {
          game.startNextRound();
        }
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
        const popupText = `Not enough players, expecting ${game.playerMinLimit - game.players.length}
          more player${plural}`;
        popupModal
          .find('.modal-body')
          .text(popupText);
        popupModal.modal('open');
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
        popupModal.modal('open');
      } else {
        $scope.searchUserText = '';
        const searchModal = $('#searchModal');
        searchModal.modal('open');
      }
    };

    $scope.abandonGame = () => {
      game.leaveGame();
      $location.path('/');
    };

    $scope.shuffleCards = () => {
      const card = $(`#${event.target.id}`);
      card.addClass('animated flipOutY');
      setTimeout(() => {
        $scope.startNextRound();
        card.removeClass('animated flipOutY');
        $('#shuffleModal').modal('close');
      }, 500);
    };
    $scope.startNextRound = () => {
      if ($scope.isCzar()) {
        game.startNextRound();
      }
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
      if ($scope.isCzar() && game.state === 'czar pick card' && game.table.length === 0) {
        $('#shuffleModal').modal({
          dismissible: false
        });
        $('#shuffleModal').modal('open');
      }
      if (game.state === 'game dissolved') {
        $('#shuffleModal').modal('close');
      }
      if ($scope.isCzar() === false && game.state === 'czar pick card'
        && game.state !== 'game dissolved'
        && game.state !== 'awaiting players' && game.table.length === 0) {
        $scope.czarHasDrawn = 'Wait! Czar is drawing Card';
        $scope.shownoCzar = true;
      }
      if (game.state !== 'czar pick card'
        && game.state !== 'awaiting players'
        && game.state !== 'game dissolve') {
        $scope.czarHasDrawn = '';
        $scope.shownoCzar = false;
      }
    });
    $scope.$watch('game.players', () => {
      $scope.usersInGame = [];
      $scope.game.players.forEach((players) => {
        $scope.usersInGame.push(players.userID);
      });
    });
    $scope.$watch('game.gameID', () => {
      if (game.gameID && game.state === 'awaiting players') {
        $scope.usersInGame = [];
        game.players.forEach((players) => {
          $scope.usersInGame.push(players.userID);
        });
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
              $('#oh-el').css({ 'text-align': 'center', 'font-size': '22px', background: 'white', color: 'black' }).text(link);
            }, 200);
            $scope.modalShown = true;
          }
        }
      });

      if ($location.search().game && !(/^\d+$/).test($location.search().game)) {
        game.joinGame('joinGame', $location.search().game);
      } else if ($location.search().custom) {
        game.joinGame('joinGame', null, true);
      } else {
        game.joinGame();
      }
    }]);