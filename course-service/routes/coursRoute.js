const express = require('express');
const Course = require('../models/Course');
const router = express.Router();

router.get('/all', async (req, res) => {
    const courses = await Course.find();
    res.json(courses);
});

router.post('/add', async (req, res) => {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json(course);
});

router.put('/update/:id', async (req, res) => {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(course);
});

router.delete('/delete/:id', async (req, res) => {
    await Course.findByIdAndDelete(req.params.id);
    res.send("Cours supprimé");
});

router.get('/search', async (req, res) => {
    const courses = await Course.findbyId(req.query.id);
    res.json(courses);
});

module.exports = router;
