angular.module('mean.system')
  .factory('socket', ['$rootScope', ($rootScope) => {
    const socket = io.connect();

    socket.on('notifyNewUser', (data) => {
      $rootScope.userNotification = data;
    });

    $rootScope.notificationModal = () => {
      $('#dropdown1').dropdown('open');
    };

    $rootScope.joinCreatedGame = (gameLink) => {
      socket.emit('joinedCreatedGame',
        { gameLink, token: window.localStorage.token });
      window.open(gameLink, '_blank'); // in new tab
    };

    return {
      on: (eventName, callback) => {
        socket.on(eventName, (...args) => {
          $rootScope.safeApply(() => {
            callback.apply(socket, args);
          });
        });
      },
      emit: (eventName, data, callback) => {
        socket.emit(eventName, data, () => {
        });
        $rootScope.safeApply((...args) => {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      },
      removeAllListeners: (eventName, callback) => {
        socket.removeAllListeners(eventName, (...args) => {
          $rootScope.safeApply(() => {
            if (callback) {
              callback.apply(socket, args);
            }
          });
        });
      }
    };
  }]);
