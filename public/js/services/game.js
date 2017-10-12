angular.module('mean.system')
  .factory('game', ['socket', '$timeout', (socket, $timeout) => {
    const game = {
      id: null, // This player's socket ID, so we know who this player is
      gameID: null,
      players: [],
      playerIndex: 0,
      winningCard: -1,
      winningCardPlayer: -1,
      gameWinner: -1,
      table: [],
      czar: null,
      playerMinLimit: 3,
      playerMaxLimit: 12,
      friendsList: [],
      usersOnline: [],
      pointLimit: null,
      state: null,
      round: 0,
      time: 0,
      curQuestion: null,
      notification: null,
      timeLimits: {},
      userNotification: [],
      joinOverride: false
    };

    const notificationQueue = [];
    let timeout = false;
    const self = this;
    let joinOverrideTimeout = 0;

    const setNotification = () => {
      if (notificationQueue.length === 0) { // If notificationQueue is empty, stop
        clearInterval(timeout);
        timeout = false;
        game.notification = '';
      } else {
        game.notification = notificationQueue.shift();
        // Show a notification and check again in a bit
        timeout = $timeout(setNotification, 1300);
      }
    };

    const addToNotificationQueue = (msg) => {
      notificationQueue.push(msg);
      if (!timeout) { // Start a cycle if there isn't one
        setNotification();
      }
    };


    let timeSetViaUpdate = false;
    const decrementTime = () => {
      if (game.time > 0 && !timeSetViaUpdate) {
        game.time -= 1;
      } else {
        timeSetViaUpdate = false;
      }
      $timeout(decrementTime, 950);
    };

    socket.on('id', (data) => {
      game.id = data.id;
    });

    socket.on('connect', (data) => {
      const userToken = window.localStorage.getItem('token');
      if (userToken) {
        socket.emit('mapUserInfo', userToken);
      }
    });

    socket.on('prepareGame', (data) => {
      game.playerMinLimit = data.playerMinLimit;
      game.playerMaxLimit = data.playerMaxLimit;
      game.pointLimit = data.pointLimit;
      game.timeLimits = data.timeLimits;
    });
    socket.on('updateFriendListandOnline', (data) => {
      game.usersOnline = [];
      data.mappedUsers.forEach((onlineUsers) => {
        game.usersOnline.push(onlineUsers.userId);
      });
      game.friendsList = data.friendList;
    });
    socket.on('updateOnlineList', (data) => {
      game.usersOnline = [];
      data.forEach((onlineUsers) => {
        game.usersOnline.push(onlineUsers.userId);
      });
    });
    game.updateFriendList = (friendID) => {
      socket.emit('updateFriendList',
        window.localStorage.token);
      game.friendsList.push(friendID);
    };

    socket.on('gameUpdate', (data) => {
      // Update gameID field only if it changed.
      // That way, we don't trigger the $scope.$watch too often
      if (game.gameID !== data.gameID) {
        game.gameID = data.gameID;
      }

      game.joinOverride = false;
      clearTimeout(game.joinOverrideTimeout);


      // Cache the index of the player in the players array
      for (let i = 0; i < data.players.length; i += 1) {
        if (game.id === data.players[i].socketID) {
          game.playerIndex = i;
        }
      }

      const newState = (data.state !== game.state);

      // Handle updating game.time
      if (data.round !== game.round && data.state !== 'awaiting players' &&
        data.state !== 'game ended' && data.state !== 'game dissolved') {
        game.time = game.timeLimits.stateChoosing - 1;
        timeSetViaUpdate = true;
      } else if (newState && data.state === 'waiting for czar to decide') {
        game.time = game.timeLimits.stateJudging - 1;
        timeSetViaUpdate = true;
      } else if (newState && data.state === 'winner has been chosen') {
        game.time = game.timeLimits.stateResults - 1;
        timeSetViaUpdate = true;
      }

      // Set these properties on each update
      game.round = data.round;
      game.winningCard = data.winningCard;
      game.winningCardPlayer = data.winningCardPlayer;
      game.winnerAutopicked = data.winnerAutopicked;
      game.gameWinner = data.gameWinner;
      game.pointLimit = data.pointLimit;

      // Handle updating game.table
      if (data.table.length === 0) {
        game.table = [];
      } else {
        const added = _.difference(_.pluck(data.table, 'player'), _.pluck(game.table, 'player'));
        const removed = _.difference(_.pluck(game.table, 'player'), _.pluck(data.table, 'player'));
        for (let i = 0; i < added.length; i += 1) {
          for (let j = 0; j < data.table.length; j += 1) {
            if (added[i] === data.table[j].player) {
              game.table.push(data.table[j], 1);
            }
          }
        }
        for (let i = 0; i < removed.length; i += 1) {
          for (let k = 0; k < game.table.length; k += 1) {
            if (removed[i] === game.table[k].player) {
              game.table.splice(k, 1);
            }
          }
        }
      }

      if (game.state !== 'waiting for players to pick' || game.players.length !== data.players.length) {
        game.players = data.players;
      }

      if (newState || game.curQuestion !== data.curQuestion) {
        game.state = data.state;
      }

      if (data.state === 'czar pick card') {
        game.czar = data.czar;
        if (game.czar === game.playerIndex) {
          addToNotificationQueue(
            `You are now a Czar, 
          click black card to pop a new question`
          );
        } else {
          addToNotificationQueue('Waiting for Czar to pick card');
        }
      } else if (data.state === 'waiting for players to pick') {
        game.czar = data.czar;
        // console.log(data);
        game.curQuestion = data.curQuestion;
        // Extending the underscore within the question
        // game.curQuestion.text = data.curQuestion.text.replace(/_/g, '<u></u>');
        game.curQuestion.text = data.curQuestion.text.replace(/_/g, '_________');
        // Set notifications only when entering state
        if (newState) {
          if (game.czar === game.playerIndex) {
            addToNotificationQueue('You\'re the Card Czar! Please wait!');
          } else if (game.curQuestion.numAnswers === 1) {
            addToNotificationQueue('Select an answer!');
          } else {
            addToNotificationQueue('Select TWO answers!');
          }
        }
      } else if (data.state === 'waiting for czar to decide') {
        if (game.czar === game.playerIndex) {
          addToNotificationQueue("Everyone's done. Choose the winner!");
        } else {
          addToNotificationQueue('The czar is contemplating...');
        }
      } else if (data.state === 'winner has been chosen' &&
        game.curQuestion.text.indexOf('<u></u>') > -1) {
        game.curQuestion = data.curQuestion;
      } else if (data.state === 'awaiting players') {
        joinOverrideTimeout = $timeout(() => {
          game.joinOverride = true;
        }, 15000);
      } else if (data.state === 'game dissolved' || data.state === 'game ended') {
        game.players[game.playerIndex].hand = [];
        game.time = 0;
      }
    });

    socket.on('notification', (data) => {
      addToNotificationQueue(data.notification);
    });

    socket.on('maxPlayerWarning', () => {
      const popupText = 'Max Players already in Game SORRY!!!';
      const popupModal = $('#popupModal');
      popupModal
        .find('.modal-body')
        .text(popupText);
      popupModal.modal('show');
    });

    game.joinGame = (mode, room, createPrivate) => {
      mode = mode || 'joinGame';
      room = room || '';
      createPrivate = createPrivate || false;

      const token = window.localStorage.getItem('token');

      socket.emit(mode, { token, room, createPrivate });
    };

    game.startGame = () => {
      socket.emit('startGame', {
        regionId: localStorage.getItem('regionId')
      });
    };

    game.leaveGame = () => {
      game.players = [];
      game.time = 0;
      socket.emit('leaveGame');
    };

    game.pickCards = (cards) => {
      socket.emit('pickCards', { cards });
    };
    game.inviteSelectedPlayers = (gameandInfo) => {
      socket.emit('inviteSelectedUsers', gameandInfo);
    };
    game.pickWinning = (card) => {
      socket.emit('pickWinning', { card: card.id });
    };

    game.startNextRound = () => {
      socket.emit('czarCardSelected');
    };

    decrementTime();

    return game;
  }]);
