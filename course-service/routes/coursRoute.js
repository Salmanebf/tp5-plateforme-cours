const express = require('express');
const Course = require('../models/CoursModel');
const router = express.Router();

router.get('/all', async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/add', async (req, res) => {
    try {
        const course = new Course(req.body);
        await course.save();
        res.status(201).json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/update/:id', async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(course);
    } catch (error) {
        res.json({ message: error.message });
    }
});

router.delete('/delete/:id', async (req, res) => {
    try {
        await Course.findByIdAndDelete(req.params.id);
        res.send("Cours supprimé");
    } catch (error) {
        res.json({ message: error.message });
    }
});

router.get('/search/:id', async (req, res) => {
    try {
        const courses = await Course.findById(req.params.id);
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
