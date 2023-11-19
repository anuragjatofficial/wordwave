'use strict';

var usernamePage = document.querySelector('#username-page');
var chatPage = document.querySelector('#chat-page');
var usernameForm = document.querySelector('#usernameForm');
var messageForm = document.querySelector('#messageForm');
var messageInput = document.querySelector('#message');
var messageArea = document.querySelector('#messageArea');
var connectingElement = document.querySelector('.connecting');

var stompClient = null;
var username = null;
var colors = [
    '#2196F3','#32C787','#00BCD4','#FF5652',
    '#FFC107','#FF85AF','#FF9800','#39BB0' 
];

const getAvatarColor = (messageSender) =>{
    let hash = 0;
    for (let i = 0; i < messageSender.length;i++){
        hash = 31* hash + messageSender.charCodeAt(i);
    }
    let index = Math.abs(hash%colors.length);
    return colors[index];
};


const connect = (event)=>{
    event.preventDefault();
    username = document.querySelector('#name').value.trim();
    if(username){
        usernamePage.classList.add('hidden');
        chatPage.classList.remove('hidden');

        let socket = new SockJS('/ws');
        stompClient = Stomp.over(socket);
        stompClient.connect({},onConnect,onError);
    } 

};

function onConnect() {
    stompClient.subscribe('/topic/public', onMessageRecived);
    // tell username to server
    stompClient.send('/app/message.adduser', {}, JSON.stringify({ sender: username, type: 'JOIN' }));
    connectingElement.classList.add('hidden');

}

function onError() {
    connectingElement.textContent = 'Could not connect to server. please refresh page and try again';
    connectingElement.style.color = 'red';
}


function onMessageRecived(payload) {

    let message = JSON.parse(payload.body);

    let messageElement = document.createElement('li');

    switch (message.type) {
        case 'JOIN':
            messageElement.classList.add('event-message');
            message.content = message.sender + ' joined!';
            break;

        case 'LEAVE':
            messageContent.classList.add('event-message');
            message.content = message.sender + ' left!';
            break;

        default:
            messageElement.classList.add('chat-message');
            let avatarElement = document.createElement('i');
            let avatarText = document.createTextNode(message.sender[0]);
            avatarElement.appendChild(avatarText);
            avatarElement.style['backgroundColor'] = getAvatarColor(message.sender);

            messageElement.appendChild(avatarElement);

            let usernameElement = document.createElement('span');
            let usernameText = document.createTextNode(message.sender);
            usernameElement.appendChild(usernameText);
            messageElement.appendChild(usernameElement);

    }

    let textElement = document.createElement('p')
    let messageText = document.createTextNode(message.content);
    textElement.appendChild(messageText);
    messageElement.appendChild(textElement);

    messageArea.appendChild(messageElement);

    messageArea.scrollTop = messageArea.scrollHeight;

}

function sendMessage(event){
    event.preventDefault();
    console.log("message sending");
    console.log(stompClient);
    let messageContent = messageInput.value.trim();
    if(messageContent && stompClient){
        
        let chatMessage = {
            sender:username,
            content:messageContent,
            type:'CHAT'
        }
        
        stompClient.send('/app/message.sendMessage',{},JSON.stringify(chatMessage));
        messageInput.content = '';
        
    }
};

usernameForm.addEventListener('submit',connect,true);

