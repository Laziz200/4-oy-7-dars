const socket = io();

socket.on('connect', () => {
    console.log('Serverga ulandi');
});

socket.on('load_messages', (messages) => {
    const chatBox = document.getElementById('chat-box');
    chatBox.innerHTML = '';
    messages.forEach(msg => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.textContent = `${msg.username}: ${msg.message}`;
        chatBox.appendChild(messageElement);
    });
    chatBox.scrollTop = chatBox.scrollHeight;
});

socket.on('new_message', (msg) => {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.textContent = `${msg.username}: ${msg.message}`;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
});

function sendMessage() {
    const username = document.getElementById('username').value;
    const message = document.getElementById('message').value;
    if (username && message) {
        socket.emit('send_message', { username, message });
        document.getElementById('message').value = '';
    }
}