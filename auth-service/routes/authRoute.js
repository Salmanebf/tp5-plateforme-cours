const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if ( !name || !email || !password) {
      return res.status(400).json({ message: "Tous les champs sont obligatoires" });
    };
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Un utilisateur avec cet email existe déjà' });
    };

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "Utilisateur créé" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Tous les champs sont obligatoires" });
    };

    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: 'User Not Found' });

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(400).json({ message: 'Invalid Password' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.status(201).json({ token: token, message: 'User Logged In' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;