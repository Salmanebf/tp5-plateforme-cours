const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();


const app = express(); 
app.use(express.json());

const port = process.env.PORT;
const host = process.env.HOST;

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db=mongoose.connection;
db.on('error', (err) => console.log(`Error connecting to database ${err}`));
db.once('open', () => console.log('Connected to Database'));


const authRoute = require('./routes/authRoute');

app.use('/auth', authRoute);

app.listen(port, () => {
    console.log(`Serveur démarré sur http://${host}:${port}`);
});