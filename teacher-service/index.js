const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');


const app = express(); 
app.use(express.json());
app.use(cors());

const port = process.env.PORT;
const host = process.env.HOST;

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db=mongoose.connection;
db.on('error', (err) => console.log(`Error connecting to database ${err}`));
db.once('open', () => console.log('Connected to Database'));

const verifyToken = require('./middleware/authMiddleware');
const teacherRoute = require('./routes/teacherRoute');

app.use('/teacher', verifyToken, teacherRoute);

app.listen(port, () => {
    console.log(`Serveur démarré sur http://${host}:${port}`);
});