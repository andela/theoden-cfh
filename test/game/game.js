const should = require('should');
const io = require('socket.io-client');

const socketURL = 'http://localhost:3000';

const options = {
  transports: ['websocket'],
  'force new connection': true
};

const cfhPlayer1 = { name: 'Tom' };
const cfhPlayer2 = { name: 'Sally' };
const cfhPlayer3 = { name: 'Dana' };

describe('Game Server', () => {
  it('Should accept requests to joinGame', (done) => {
    const client1 = io.connect(socketURL, options);
    const disconnect = () => {
      client1.disconnect();
      done();
    };
    client1.on('connect', () => {
      client1.emit('joinGame', { userID: 'unauthenticated', room: '', createPrivate: false });
      setTimeout(disconnect, 200);
    });
  });

  it('Should send a game update upon receiving request to joinGame', (done) => {
    const client1 = io.connect(socketURL, options);
    const disconnect = () => {
      client1.disconnect();
      done();
    };
    client1.on('connect', () => {
      client1.emit('joinGame', { userID: 'unauthenticated', room: '', createPrivate: false });
      client1.on('gameUpdate', (data) => {
        data.gameID.should.match(/\d+/);
      });
      setTimeout(disconnect, 200);
    });
  });

  it('Should announce new user to all users', (done) => {
    const client1 = io.connect(socketURL, options);
    let client2;
    const disconnect = () => {
      client1.disconnect();
      client2.disconnect();
      done();
    };
    client1.on('connect', () => {
      client1.emit('joinGame', { userID: 'unauthenticated', room: '', createPrivate: false });
      client2 = io.connect(socketURL, options);
      client2.on('connect', () => {
        client2.emit('joinGame', { userID: 'unauthenticated', room: '', createPrivate: false });
        client1.on('notification', (data) => {
          data.notification.should.match(/ has joined the game!/);
        });
      });
      setTimeout(disconnect, 200);
    });
  });

  it('Should start game when startGame event is sent with 3 players', (done) => {
    let client2, client3;
    const client1 = io.connect(socketURL, options);
    const disconnect = () => {
      client1.disconnect();
      client2.disconnect();
      client3.disconnect();
      done();
    };
    const expectStartGame = () => {
      client1.emit('startGame');
      client1.on('gameUpdate', (data) => {
        data.state.should.equal('waiting for players to pick');
      });
      client2.on('gameUpdate', (data) => {
        data.state.should.equal('waiting for players to pick');
      });
      client3.on('gameUpdate', (data) => {
        data.state.should.equal('waiting for players to pick');
      });
      setTimeout(disconnect, 200);
    };
    client1.on('connect', () => {
      client1.emit('joinGame', { userID: 'unauthenticated', room: '', createPrivate: false });
      client2 = io.connect(socketURL, options);
      client2.on('connect', () => {
        client2.emit('joinGame', { userID: 'unauthenticated', room: '', createPrivate: false });
        client3 = io.connect(socketURL, options);
        client3.on('connect', () => {
          client3.emit('joinGame', { userID: 'unauthenticated', room: '', createPrivate: false });
          setTimeout(expectStartGame, 100);
        });
      });
    });
  });

  it('Should return Max users reached if more than 12 users try to join', (done) => {
    let client2, client3, client4, client5, client6;
    let client7, client8, client9, client10, client11;
    let client12, client13;
    const client1 = io.connect(socketURL, options);
    const disconnect = () => {
      client1.disconnect();
      client2.disconnect();
      client3.disconnect();
      client4.disconnect();
      client5.disconnect();
      client6.disconnect();
      client7.disconnect();
      client8.disconnect();
      client9.disconnect();
      client10.disconnect();
      client11.disconnect();
      client12.disconnect();
      client13.disconnect();
      done();
    };
    client1.on('connect', () => {
      client1.emit('joinGame', { userID: 'unauthenticated', room: '', createPrivate: true });
      let connectOthers = true;
      client1.on('gameUpdate', (data) => {
        const gameID = data.gameID;
        if (connectOthers) {
          client2 = io.connect(socketURL, options);
          connectOthers = false;
          client2.on('connect', () => {
            client2.emit('joinGame', { userID: 'unauthenticated', room: gameID, createPrivate: false });
            client3 = io.connect(socketURL, options);
            client3.on('connect', () => {
              client3.emit('joinGame', { userID: 'unauthenticated', room: gameID, createPrivate: false });
              client4 = io.connect(socketURL, options);
              client4.on('connect', () => {
                client4.emit('joinGame', { userID: 'unauthenticated', room: gameID, createPrivate: false });
                client5 = io.connect(socketURL, options);
                client5.on('connect', () => {
                  client5.emit('joinGame', { userID: 'unauthenticated', room: gameID, createPrivate: false });
                  client6 = io.connect(socketURL, options);
                  client6.on('connect', () => {
                    client6.emit('joinGame', { userID: 'unauthenticated', room: gameID, createPrivate: false });
                    // setTimeout(expectStartGame, 100);
                    client7 = io.connect(socketURL, options);
                    client7.on('connect', () => {
                      client7.emit('joinGame', { userID: 'unauthenticated', room: gameID, createPrivate: false });
                      // setTimeout(expectStartGame, 100);
                      client8 = io.connect(socketURL, options);
                      client8.on('connect', () => {
                        client8.emit('joinGame', { userID: 'unauthenticated', room: gameID, createPrivate: false });
                        // setTimeout(expectStartGame, 100);
                        client9 = io.connect(socketURL, options);
                        client9.on('connect', () => {
                          client9.emit('joinGame', { userID: 'unauthenticated', room: gameID, createPrivate: false });
                          // setTimeout(expectStartGame, 100);
                          client10 = io.connect(socketURL, options);
                          client10.on('connect', () => {
                            client10.emit('joinGame', { userID: 'unauthenticated', room: gameID, createPrivate: false });
                            // setTimeout(expectStartGame, 100);
                            client11 = io.connect(socketURL, options);
                            client11.on('connect', () => {
                              client11.emit('joinGame', { userID: 'unauthenticated', room: gameID, createPrivate: false });
                              client12 = io.connect(socketURL, options);
                              client12.on('connect', () => {
                                client12.emit('joinGame', { userID: 'unauthenticated', room: gameID, createPrivate: false });
                                client13 = io.connect(socketURL, options);
                                client13.on('connect', () => {
                                  client13.emit('joinGame', { userID: 'unauthenticated', room: gameID, createPrivate: false });
                                  // setTimeout(expectErrorMessage, 900);
                                  client1.on('notification', (dataInfo) => {
                                    dataInfo.notification.should.match(/MAX Players in here already fam!!!/);
                                    setTimeout(disconnect, 200);
                                  });
                                });
                              });
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        }
      });
    });
  });
});
