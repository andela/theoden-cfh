const mongoose = require('mongoose');
const firebase = require('firebase');
const decodeJWT = require('../../app/controllers/middleware/auth').decodeJWT;
const Game = require('./game');
const Player = require('./player');
require('console-stamp')(console, 'm/dd HH:MM:ss');

const User = mongoose.model('User');
const UserNotification = mongoose.model('UserNotification');
const UserFriends = mongoose.model('UserFriends');

// Initialize Firebase
// Set database ref
const config = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_ID
};

firebase.initializeApp(config);

const avatars = require('../../app/controllers/avatars.js').all();
// Valid characters to use to generate random private game IDs
const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';

/**
 * @param {object} io
 * @returns {*} void
 */

const mappedUsers = [];
let chatMessages = [];

module.exports = (io) => {
  let game;
  const allGames = {};
  const customGames = {};
  const allPlayers = {};
  const gamesNeedingPlayers = [];
  let gameID = 0;
  const database = firebase.database();

  io.sockets.on('connection', (socket) => {
    console.log(`${socket.id} Connected`);

    socket.emit('id', { id: socket.id });

    // send recieved chat message to all connected sockets
    // in particular game room
    socket.on('new message', (message) => {
      if (socket.gameID) {
        socket.broadcast.to(socket.gameID).emit('add message', message);
        chatMessages.push(message);
        database.ref(`chat/room_${socket.gameID}`).push(message);
      }
    });

    socket.on('mapUserInfo', (data) => {
      if (data) {
        const decodedInfo = decodeJWT(data);
        if (decodedInfo) {
          mappedUsers.push({
            userId: decodedInfo.id,
            socketID: socket.id
          });

          setTimeout(() => updateFriendListandOnline(decodedInfo.id), 100);
        }
      }
    });
    setTimeout(() => sendNotificationToInvitees(), 300);

    socket.on('updateFriendList', (data) => {
      if (data) {
        const decodedInfo = decodeJWT(data);
        if (decodedInfo && decodedInfo !== 'unauthenticated') {
          setTimeout(() => updateFriendListandOnline(decodedInfo.id), 100);
        }
      }
    });

    const updateFriendListandOnline = (userId) => {
      UserFriends.findOne({
        userID: userId
      }).exec((err, friendList) => {
        if (friendList) {
          // emit to current user
          socket.emit('updateFriendListandOnline',
            { friendList: friendList.friendIDs, mappedUsers });
          socket.broadcast.emit('updateOnlineList', mappedUsers);
        }
      });
    };
    const sendNotificationNow = (data) => {
      mappedUsers.forEach((playersToInvite) => {
        const notificationsForUser = [];
        if (Array.isArray(data.players)) {
          console.log('stuff');
        } else {
          console.log(data, 'data');
          if (playersToInvite.userId === data.players) {
            notificationsForUser.push({
              gameID: data.gameID,
              gameURL: data.gameURL,
              inviteName: data.inviteName
            });
            io
              .sockets
              .socket(playersToInvite.socketID)
              .emit('notifyNewUser', notificationsForUser
              );
          }
        }
      });
    }
    const sendNotificationToInvitees = () => {
      const gamesKeys = Object.keys(customGames);
      UserNotification
        .find({
          gameID: {
            $in: gamesKeys
          },
          isRead: false,
        })
        .exec((error, result) => {
          if (result && result.length > 0) {
            mappedUsers.forEach((playersToInvite) => {
              const notificationsForUser = [];
              result.forEach((notifications) => {
                if (playersToInvite.userId === notifications.userID) {
                  notificationsForUser.push(notifications);
                }
              });
              io
                .sockets
                .socket(playersToInvite.socketID)
                .emit('notifyNewUser', notificationsForUser
                );
            });
          }
        });
    };


    socket.on('inviteSelectedUsers', (data) => {
      if (data) {
        data.selectedUsers.forEach((players, index) => {
          const userNotifications = new UserNotification(
            {
              userID: players,
              isRead: false,
              gameID: data.gameID,
              gameURL: data.gameURL,
              inviteName: data.inviteName
            }
          );
          userNotifications.save();
          sendNotificationNow({
            players,
            gameID: data.gameID,
            gameURL: data.gameURL,
            inviteName: data.inviteName
          });
        });
      }
      // sendNotificationToInvitees

    });

    socket.on('joinedCreatedGame', (data) => {
      const decodedInfo = decodeJWT(data.token);
      UserNotification
        .update(
        {
          userID: decodedInfo.id,
          gameURL: data.gameLink
        },
        { isRead: true },
        (err) => {
          console.log(err, '=-0987');
        });
      setTimeout(() => sendNotificationToInvitees(), 300);
    });

    socket.on('pickCards', (data) => {
      console.log(socket.id, 'picked', data);
      if (allGames[socket.gameID]) {
        allGames[socket.gameID].pickCards(data.cards, socket.id);
      } else {
        console.log('Received pickCard from', socket.id, 'but game does not appear to exist!');
      }
    });

    socket.on('pickWinning', (data) => {
      if (allGames[socket.gameID]) {
        allGames[socket.gameID].pickWinning(data.card, socket.id);
      } else {
        console.log('Received pickWinning from', socket.id, 'but game does not appear to exist!');
      }
    });

    socket.on('joinGame', (data) => {
      if (!allPlayers[socket.id]) {
        joinGame(socket, data);
      }
      // Load chat when user joins group
      database.ref(`chat/room_${socket.gameID}`).once('value', (snapshot) => {
        const savedMessages = [];
        snapshot.forEach((message) => {
          savedMessages.push(message);
        });
        chatMessages = savedMessages;
        socket.emit('loadChat', chatMessages);
      });
    });

    socket.on('joinNewGame', (data) => {
      exitGame(socket);
      joinGame(socket, data);
    });

    socket.on('startGame', (data) => {
      if (allGames[socket.gameID]) {
        const thisGame = allGames[socket.gameID];
        thisGame.regionId = data.regionId;
        console.log('comparing', thisGame.players[0].socket.id, 'with', socket.id);
        if (thisGame.players.length >= thisGame.playerMinLimit) {
          // Remove this game from gamesNeedingPlayers so new players can't join it.
          gamesNeedingPlayers.forEach((gameNeeding, index) => {
            if (gameNeeding.gameID === socket.gameID) {
              UserNotification.findById({
                gameID: socket.gameID
              }).remove().exec();
              return gamesNeedingPlayers.splice(index, 1);
            }
          });
          thisGame.prepareGame();
          thisGame.sendNotification('The game has begun!');
        }
      }
    });

    socket.on('czarCardSelected', () => {
      allGames[socket.gameID].startNextRound(allGames[socket.gameID]);
    });

    socket.on('leaveGame', () => {
      exitGame(socket);
    });

    socket.on('disconnect', () => {
      mappedUsers.forEach((clients, index) => {
        if (clients.socketID === socket.id) {
          mappedUsers.splice(index, 1);
        }

      });
      console.log('Rooms on Disconnect ', io.sockets.manager.rooms);

      socket.broadcast.emit('updateOnlineList', mappedUsers);
      exitGame(socket);
    });
  });

  let joinGame = (socket, data) => {
    const player = new Player(socket);

    const decodedToken = decodeJWT(data.token);

    data.userID = decodedToken.id;

    data = data || {};

    player.userID = data.userID || 'unauthenticated';

    if (data.userID !== 'unauthenticated') {
      User.findOne({
        _id: data.userID
      }).exec((err, user) => {
        if (err) {
          console.log('err', err);
          return err; // Hopefully this never happens.
        }
        if (!user) {
          // If the user's ID isn't found (rare)
          player.username = 'Guest';
          player.avatar = avatars[Math.floor(Math.random() * 4) + 12];
        } else {
          player.username = user.name;
          player.premium = user.premium || 0;
          player.avatar = user.avatar || avatars[Math.floor(Math.random() * 4) + 12];
        }
        getGame(player, socket, data.room, data.createPrivate);
      });
    } else {
      // If the user isn't authenticated (guest)
      player.username = 'Guest';
      player.avatar = avatars[Math.floor(Math.random() * 4) + 12];
      getGame(player, socket, data.room, data.createPrivate);
    }
  };
  /**
   *
   * @param {*} player
   * @param {*} socket
   * @param {*} requestedGameId
   * @param {*} createPrivate
   * @return {*} void
   */
  const getGame = (player, socket, requestedGameId, createPrivate) => {
    requestedGameId = requestedGameId || '';
    createPrivate = createPrivate || false;
    console.log(socket.id, 'is requesting room', requestedGameId);
    if (requestedGameId.length && allGames[requestedGameId]) {
      console.log('Room', requestedGameId, 'is valid');
      game = allGames[requestedGameId];
      // Ensure that the same socket doesn't try to join the same game
      // This can happen because we rewrite the browser's URL to reflect
      // the new game ID, causing the view to reload.
      // Also checking the number of players, so node doesn't crash when
      // no one is in this custom room.
      if (game.state === 'awaiting players' && (!game.players.length ||
        game.players[0].socket.id !== socket.id)
        && (game.players.length < game.playerMaxLimit)
      ) {
        // Put player into the requested game
        console.log('Allowing player to join', requestedGameId);
        allPlayers[socket.id] = true;
        game.players.push(player);
        socket.join(game.gameID);
        socket.gameID = game.gameID;
        game.assignPlayerColors();
        game.assignGuestNames();
        game.sendUpdate();
        game.sendNotification(`${player.username}  has joined the game!`);
        if (game.players.length >= game.playerMaxLimit) {
          gamesNeedingPlayers.shift();
        }
      } else {
        game.sendNotification('MAX Players in here already fam!!!');
        gamesNeedingPlayers.shift();
        socket.emit('maxPlayerWarning');
      }
    } else {
      // Put players into the general queue
      console.log('Redirecting player', socket.id, 'to general queue');
      if (createPrivate) {
        createGameWithFriends(player, socket);
      } else {
        fireGame(player, socket);
      }
    }
  };

  const fireGame = (player, socket) => {
    if (gamesNeedingPlayers.length <= 0) {
      gameID += 1;
      const gameIDStr = gameID.toString();
      game = new Game(gameIDStr, io);
      allPlayers[socket.id] = true;
      game.players.push(player);
      allGames[gameID] = game;
      gamesNeedingPlayers.push(game);
      socket.join(game.gameID);
      socket.gameID = game.gameID;
      console.log(socket.id, 'has joined newly created game', game.gameID);
      game.assignPlayerColors();
      game.assignGuestNames();
      game.sendUpdate();
    } else {
      game = gamesNeedingPlayers[0];
      allPlayers[socket.id] = true;
      game.players.push(player);
      console.log(socket.id, 'has joined game', game.gameID);
      socket.join(game.gameID);
      socket.gameID = game.gameID;
      game.assignPlayerColors();
      game.assignGuestNames();
      game.sendUpdate();
      game.sendNotification(`${player.username} has joined the game!`);
      if (game.players.length >= game.playerMaxLimit) {
        gamesNeedingPlayers.shift();
        game.prepareGame();
      }
    }
  };

  const createGameWithFriends = (player, socket) => {
    let isUniqueRoom = false;
    let uniqueRoom = '';
    // Generate a random 6-character game ID
    while (!isUniqueRoom) {
      uniqueRoom = '';
      for (let i = 0; i < 6; i += 1) {
        uniqueRoom += chars[Math.floor(Math.random() * chars.length)];
      }
      if (!allGames[uniqueRoom] && !(/^\d+$/).test(uniqueRoom)) {
        isUniqueRoom = true;
      }
    }
    console.log(socket.id, 'has created unique game', uniqueRoom);
    game = new Game(uniqueRoom, io);
    allPlayers[socket.id] = true;
    game.players.push(player);
    allGames[uniqueRoom] = game;
    customGames[uniqueRoom] = game.gameID;
    socket.join(game.gameID);
    socket.gameID = game.gameID;
    game.assignPlayerColors();
    game.assignGuestNames();
    game.sendUpdate();
  };

  let exitGame = (socket) => {
    console.log(socket.id, 'has disconnected');
    if (allGames[socket.gameID]) { // Make sure game exists
      game = allGames[socket.gameID];
      // Clear game room chats saved on firebase
      // When the last user left
      if (game.players.length < 2) {
        database.ref(`chat/room_${socket.gameID}`).remove();
      }
      console.log(socket.id, 'has left game', game.gameID);
      delete allPlayers[socket.id];
      if (game.state === 'awaiting players' ||
        game.players.length - 1 >= game.playerMinLimit) {
        game.removePlayer(socket.id);
      } else {
        game.stateDissolveGame();
        for (let j = 0; j < game.players.length; j += 1) {
          game.players[j].socket.leave(socket.gameID);
        }
        game.killGame();
        database.ref(`chat/room_${socket.gameID}`).remove();
        delete allGames[socket.gameID];
        delete customGames[socket.gameID];
        // delete notification from database
        UserNotification.findById({
          gameID: socket.gameID
        }).remove().exec();
      }
    }
    socket.leave(socket.gameID);
  };
};
