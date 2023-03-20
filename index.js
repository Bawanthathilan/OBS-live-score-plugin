const express = require('express');
const app = express();
const socketio = require('socket.io');
const http = require('http');
const path = require('path');

const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'views')));

app.get('/', (req, res) => {

    res.sendFile('index.html');

});

//get realtime data from firebase cloud firestore

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();


app.get('/', (req, res) => {
    res.render('index', { score });

});

io.on('connection', (socket) => {
    console.log('New client connected');

    //get data from firebase

    db.collection('Score').onSnapshot((snapshot) => {
        snapshot.forEach((doc) => {
            console.log(doc.id, '=>', doc.data());

            //send data from socket.io

            socket.emit('score', doc.data());

            // io.emit('score', doc.data());

            return doc.data();

        });
        
    }, (err) => {
        console.log(`Encountered error: ${err}`);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
  });

server.listen(3000, () => console.log('Example app listening on port 3000!'));
