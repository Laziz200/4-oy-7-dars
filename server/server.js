const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const MESSAGES_FILE = path.join(__dirname, 'messages.json');

async function loadMessages() {
    try {
        if (await fs.access(MESSAGES_FILE).then(() => true).catch(() => false)) {
            const data = await fs.readFile(MESSAGES_FILE, 'utf8');
            return JSON.parse(data);
        }
        return [];
    } catch (err) {
        console.error('Xabarlarni yuklashda xato:', err);
        return [];
    }
}

async function saveMessage(message) {
    try {
        const messages = await loadMessages();
        messages.push(message);
        await fs.writeFile(MESSAGES_FILE, JSON.stringify(messages, null, 4));
    } catch (err) {
        console.error('Xabarni saqlashda xato:', err);
    }
}

io.on('connection', (socket) => {
    console.log('Foydalanuvchi ulandi');
    loadMessages().then(messages => socket.emit('load_messages', messages));

    socket.on('send_message', async (data) => {
        const msgData = {
            username: data.username,
            message: data.message,
            timestamp: new Date().toISOString()
        };
        await saveMessage(msgData);
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