const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const MESSAGES_FILE = path.join(__dirname, 'messages.json');

function loadMessages() {
    if (fs.existsSync(MESSAGES_FILE)) {
        return JSON.parse(fs.readFileSync(MESSAGES_FILE));
    }
    return [];
}

function saveMessage(message) {
    const messages = loadMessages();
    messages.push(message);
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 4));
}

io.on('connection', (socket) => {
    console.log('Foydalanuvchi ulandi');
    socket.emit('load_messages', loadMessages());

    socket.on('send_message', (data) => {
        const msgData = { username: data.username, message: data.message };
        saveMessage(msgData);
        io.emit('new_message', msgData);
    });

    socket.on('disconnect', () => {
        console.log('Foydalanuvchi uzildi');
    });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log(`Server ${PORT}-portda ishlamoqda`);
});