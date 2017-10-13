angular.module('mean.system')
  .controller('chat', ['$scope', 'socket', 'game', ($scope, socket, game) => {
    $scope.showChat = true;
    $scope.messages = [];

    $scope.chatLoading = true;
    $scope.chatOpenClose = 'expand_more';
    $scope.chatNotifs = 0;
    $scope.showChatNotif = false;

    // Initialize emojioneArea
    $('#chat-input').emojioneArea({
      filtersPosition: 'top',
      pickerPosition: 'top',
      tonesStyle: 'radio',
      inline: true,
      hidePickerOnBlur: true
    });

    $('body').on('keyup', '.emojionearea-editor', (event) => {
      if (event.keyCode === 13 || event.which === 13) {
        $('.emojionearea-editor').trigger('blur');
        $scope.send();
      }
    });

    // Toggle chat window when minimize 
    // or expand icon is clicked
    $scope.toggleChat = () => {
      $scope.showChat = !$scope.showChat;
      $scope.chatNotifs = $scope.showChat ? 0 : $scope.chatNotifs;
      $scope.chatOpenClose = $scope.showChat ? 'expand_more' : 'expand_less';
      $scope.showChatNotif = !$scope.showChat && Boolean($scope.chatNotifs);
      if ($scope.showChat) {
        $scope.scroll.scrollNow();
      }
    };

    // Get length measurements
    // For autoscroll
    $scope.getLength = () => {
      const messages = $('#chat-content');
      const newMessage = messages.children('li:last-child');
      const clientHeight = messages.prop('clientHeight');
      const scrollTop = messages.prop('scrollTop');
      const scrollHeight = messages.prop('scrollHeight');
      const newMessageHeight = newMessage.innerHeight();
      const lastMessageHeight = newMessage.prev().innerHeight();

      return {
        messages,
        newMessage,
        clientHeight,
        scrollTop,
        scrollHeight,
        newMessageHeight,
        lastMessageHeight
      };
    };

    $scope.scroll = {
      scrollNow: () => {
        setTimeout(() => {
          const { messages, scrollHeight } = $scope.getLength();
          messages.scrollTop(scrollHeight);
        }, 300);
      },
      // Check if user is near the bottom
      // Do not autoscroll if user has
      // scrolled up to read messages
      checkAndScroll: () => {
        setTimeout(() => {
          const {
            scrollTop, clientHeight,
            newMessageHeight, lastMessageHeight,
            scrollHeight, messages
          } = $scope.getLength();
          if (scrollTop + clientHeight + newMessageHeight + lastMessageHeight >= scrollHeight) {
            messages.scrollTop(scrollHeight);
          }
        }, 300);
      }
    };

    // Initialize chat when user joins room
    socket.on('loadChat', (messages) => {
      $scope.chatLoading = false;
      $scope.messages = messages;
      $scope.scroll.scrollNow();
    });

    // Listen for new messages and
    // push new message to list
    socket.on('add message', (message) => {
      $scope.messages.push(message);
      $scope.scroll.checkAndScroll();
      if (!$scope.showChat) {
        $scope.chatNotifs += 1;
        $scope.showChatNotif = !$scope.showChat && Boolean($scope.chatNotifs);
      }
    });

    // Send chat when user submits message
    $scope.send = () => {
      // Pick message value with jQuery to fix bug
      // where emojionearea overrides ng-model 
      $scope.message = $('#chat-input').val();
      $scope.sender = game.players[game.playerIndex];
      const newMessage = {
        timeSent: new Date(Date.now()).toLocaleTimeString({
          hour12: true
        }),
        avatarUrl: $scope.sender.avatar,
        sender: $scope.sender.username,
        message: $scope.message
      };

      if ($scope.message) {
        $scope.messages.push(newMessage);
        socket.emit('new message', newMessage);
        $scope.message = '';
      }
      $('.emojionearea > .emojionearea-editor').text('');
      $scope.scroll.checkAndScroll();
      $('.emojionearea-editor').focus();
    };
  }]);
