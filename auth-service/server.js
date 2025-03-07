const mongoose = require('mongoose');
require('dotenv').config();


mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db=mongoose.connection;
db.on('error', (err) => console.log(`Error connecting to database ${err}`));
db.once('open', () => console.log('Connected to Database'));

