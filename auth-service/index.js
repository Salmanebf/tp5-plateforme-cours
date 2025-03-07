const express = require('express');
require('dotenv').config();
const cors = require('cors');
require('./server');

const app = express(); 
app.use(express.json());
app.use(cors());

const PORT = 3000;


const authRoute = require('./routes/authRoute');

app.use('/auth',  authRoute);

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});