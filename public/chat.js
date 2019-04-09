$(function(){
    var socket = io.connect('https://habla2.herokuapp.com/');
    console.log(socket);
    var message = $('#message');
    var user = $('#user');
    var send_message = $('#send_message');
    var send_username = $('#send_username');
    var chatroom  = $('#chatroom');
    var title = $('#title');

    //events
    send_username.click(function(){
        console.log('Username', user.val())
        socket.emit('change_username', {username: user.val()});
        title.html(user.val());
        user.val('');
    })

    send_message.click(function(){
        socket.emit('message_client', {message: message.val(), username: title.val()});
        message.val('');
    })

    socket.on('message_server', function(data){
        console.warn('Mensaje recibido: ',data)
        chatroom.append('<li class="list-group-item">'+data.username+': '+data.message+'</li>')
    })
})