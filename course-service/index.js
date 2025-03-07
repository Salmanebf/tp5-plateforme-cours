const express = require('express');
require('dotenv').config();
const cors = require('cors');

const app = express(); 
app.use(express.json());
app.use(cors());

const PORT = 3000;

const verifyToken = require('../middleware/auth');
const coursRoute = require('../routes/coursRoute');

app.use('/cours', verifyToken, coursRoute);

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});