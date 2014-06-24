$(document).ready(function(){
// YOUR CODE HERE:
window.URL = "https://localhost:3000/1/classes/messages";
window.accountName = "Joel"

// Create Variable for jquery selectors;
// LIST CONTAINERS

var Server = function(){
  var _messages = {};
  var _users = {};
  var _rooms = {};
  var divide = function( item ){
    _messages[item.objectId] = item;
    _users[item.username] = item;
    _rooms[item.roomname] = item;
    /*console.log("messages", _messages)
    console.log("users", _users)
    console.log("rooms", _rooms)*/
  };
  return {
    init: function(){
      return $.ajax({
        type: "GET",
        url: URL,
        data: {order: "-createdAt"},
        contentType: "application/json",
        success:function(data){
          _.each(data.results, function (item){
            divide( item );
          });
         // console.log(data);
        }
      });
    },
    get: function(){
      return $.ajax({
        type: "GET",
        url: URL,
        data: {order: "-createdAt"},
        contentType: "application/json",
        success:function(data){
          _.each(data.results, function (item){
            divide( item );
          });
          console.log(data);
        }
      });
    },
    create: function ( data ){
      var text = data.text;
      var userN = data.username;
      var roomN = data.username;      
      return $.ajax({
        type: "POST",
        url: URL,
        data: JSON.stringify(data),
        contentType: "application/json",
        success: function( newData ){
          newData.text = text;
          newData.username = userN;
          newData.roomname = roomN;
          divide(newData);
        },
      });
    },
    update: function ( data, id ){
      return $.ajax({
        type: "PUT",
        url: URL + "/" + id
      });
    },
    destroy: function (id){
      return $.ajax({
        type: "DELETE",
        url: URL + "/" + id,
        contentType: "application/json",
        success: function(data){
          console.log(data);
        }
      });
    },    
    rooms: function(){
      return _rooms;
    },
    messages: function(){
      return _messages;
    },
    users: function(){
      return _users;
    },
    death: function(){
      _.each(_messages, function (item){
        Server().destroy(item.objectId);
      });
    }
  }
}

$usersList    = $('#usersList');
$messageList  = $('#messagesList');
$roomsList    = $('#roomsList');
$roomPanel    = $('#roomPanel');
$panelHead    = $('#panel-head');
// BUTTONS
$createMsgBtn   = $('#createMsgBtn');
$createRoomBtn  = $('#createRoomBtn');
// Inputs
$createMsgInput = $('#createMsgInput');
$createRoomInput = $('#createRoomInput');


       
var server = Server();

var Room = function(room){
  this.id = room.objectId;
  this.name = room.roomname;
  this.username = room.username;
  this.$header = this.makeForm();
  //this.$header = this.makeHeader();
  this.$node = $('<li class="list-group-item">' + room.roomname + '</li>');  
  this.$dbtn = $('<button><i class="fa fa-times"></i></button>').addClass('btn btn-xs btn-default pull-right');
};
Room.prototype.init = function(){
  var self = this;
  $roomsList.append(this.$node);
  $panelHead.append(this.$header)
  this.$header.hide();
  this.$node.append(this.$dbtn);
  this.$dbtn.on('click', function(){
    self.destroy();
  });
  this.$node.on('click', function(){
    $panelHead.find('form').hide();
    self.$header.show();
  });
  this.$header.on('submit', function(e){
    e.preventDefault();
    var data = {
      username: accountName,
      roomname: app.selectedRoom,
      text: self.$header.find('input').val(),
    }
    server.create(data)
      .success( function (newData){
        newData.username = data.username
        newData.roomname = data.roomname
        newData.text = data.text;
        var message = new Message( newData );
        message.init();
      });

  });
};
Room.prototype.destroy = function(){
  var self = this;
  _.each(server.messages(), function ( message ){
    if( message.roomname === self.name ){    
      server.destroy(message.objectId);        
    }
  });
};
Room.prototype.makeHeader = function(){
  return $("\
    <div class='panel'> \
      <div class='panel-heading'> \
        "+ this.name +" –<small>"+ this.username +"</small> \
        <button class='btn btn-warning btn-xs pull-right'><i class='fa fa-thumbs-up'></i></button> \
      </div> \
    </div> \
  ");
};
Room.prototype.makeForm = function(){
  return $("\
    <form id='form_"+ this.name +"' style='padding:0; margin-botton:0;' > \
      <div class='input-group'> \
        <input type='text' placeholder='Message. . .' class='form-control'> \
        <span class='input-group-btn'> \
          <button type='submit' class='btn btn-success'>Send</button> \
        </span> \
      </div> \
    </form> \
  ");
};
var Message = function( message ){
  this.id = message.objectId;
  this.$node = $("<li></li>").addClass('list-group-item ' + message.roomname).text(message.text).css('text-align', 'left');
  this.$label = $('<label></label>').addClass('label label-info pull-right').text(message.username);
};
Message.prototype.init = function(){
  $messageList.prepend(this.$node);
  this.$node.append(this.$label);
};


var User = function( user ){
  this.$node = $('<li class="list-group-item">' + user.username + '</li>');
}
User.prototype.init = function(){
  $usersList.append(this.$node);
}

var app = {
  selectedRoom: "",
  users: function(){
    var users = server.users();
    _.each(users, function ( item ) {
      var user = new User(item)
      user.init();
    });
  },
  messages: function(){
    var messages = server.messages();
    _.each(messages, function ( item ){
      var message = new Message( item );
      message.init();
    });
  },
  rooms: function(){
    //var server = Server();
    var rooms = server.rooms();
    _.each(rooms, function ( room ){
      if(room.roomname){
        var room = new Room( room );
        room.init();
      }
    });    
  },
  init:function(){
    //var server = Server();
    //server.init();
    //var messages = messageList();
    //messages.init();
    var rooms;
    server.get()
      .success(function(){
        app.rooms();
        app.messages();    
        app.users();    
      });
  }
}
  server.init();
  app.init();

/*x*/

  $('#refreshBtn').on('click', function(){
    server.init();
    app.init();
    $roomsList.html("")
    $messageList.html("")
    $usersList.html("")

  });


  $("#roomsList").on('click', 'li', function(){
    app.selectedRoom = $(this).text();
    //var c = "." += $(this).text();
    $messageList.find('li').hide();
    $messageList.find("." + $(this).text()).show();
    $roomsList.find('li').removeClass('bg-info');
    $(this).addClass('bg-info');
    //$panelHead.find('form').hide();
    //$panelHead.find('.' + $(this).text()).show();
  });
  $createMsgBtn.on('click', function(){
    var data = {
      username: "Joel",
      roomname: app.selectedRoom,
      text: $createMsgInput.val()
    }
    server.create(data)
      .success(function ( data ){
        console.log(" data", data)
      })
  });
  $createMsgBtn.on('click', function(){
    var data = {
      username: "Joel",
      roomname: app.selectedRoom,
      text: $createMsgInput.val()
    }
    server.create(data)
      .success(function ( data ){
        console.log(" data", data)
      })
  });
  $createRoomBtn.on('click', function(){
    var data = {
      username: "Joel",
      roomname: $createRoomInput.val(),
      text: "Welcome to my new room. Please follow me!",
    }
    server.create(data)
      .success(function ( data ){
        app.selectedRoom = $createRoomInput.val();
        console.log(" new room", data)
      })
  });
  $('#showCreate').on('click', function(){
    $roomPanel.find('.panel-heading').hide();
    $roomPanel.find('.input-group').show('slow');
  });
})
