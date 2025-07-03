const socket = io();

socket.on('connect', () => {
    console.log('Serverga ulandi');
    const chatBox = document.getElementById('chat-box');
    const status = document.createElement('div');
    status.classList.add('status');
    status.textContent = 'Serverga ulandingiz!';
    chatBox.appendChild(status);
    chatBox.scrollTop = chatBox.scrollHeight;
});

socket.on('load_messages', (messages) => {
    const chatBox = document.getElementById('chat-box');
    chatBox.innerHTML = '';
    const currentUsername = document.getElementById('username').value;
    messages.forEach(msg => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.classList.add(msg.username === currentUsername ? 'my-message' : 'other-message');
        messageElement.textContent = `[${new Date(msg.timestamp).toLocaleTimeString()}] ${msg.username}: ${msg.message}`;
        chatBox.appendChild(messageElement);
    });
    chatBox.scrollTop = chatBox.scrollHeight;
});

socket.on('new_message', (msg) => {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    const currentUsername = document.getElementById('username').value;
    messageElement.classList.add(msg.username === currentUsername ? 'my-message' : 'other-message');
    messageElement.textContent = `[${new Date(msg.timestamp).toLocaleTimeString()}] ${msg.username}: ${msg.message}`;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
});

function sendMessage() {
    const username = document.getElementById('username').value.trim();
    const message = document.getElementById('message').value.trim();
    if (username && message && username.length <= 50 && message.length <= 1000) {
        socket.emit('send_message', { username, message });
        document.getElementById('message').value = '';
    } else {
        alert('Iltimos, to‘g‘ri foydalanuvchi ismi va xabar kiriting!');
    }
}

document.getElementById('message').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});