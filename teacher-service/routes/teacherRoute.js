const express = require('express');
const Teacher = require('../models/TeacherModel');
const axios = require("axios");
const router = express.Router();

router.get('/all', async (req, res) => {
    try {
        const teachers = await Teacher.find();
        res.json(teachers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/add', async (req, res) => {
    try {
        const teacher = new Teacher(req.body);
        await teacher.save();
        res.status(201).json(teacher);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/assign/:professeur_id/:cours_id', async (req, res) => {
    const teacher = await Teacher.findById(req.params.professeur_id);
    teacher.cours.push(req.params.cours_id);
    await teacher.save();
    res.send("Cours attribué");
});

router.get("/enrolledStudents/:cours_id", async (req, res) => {
    try {
        const response = await axios.get('http://localhost:3002/student/all', {
            headers: { 
                'Authorization': req.headers['authorization']
            }
        });
        const allStudents = response.data;
        const enrolledStudents = allStudents.filter(student => student.cours && student.cours.includes(req.params.cours_id) );
        res.status(200).json(enrolledStudents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});




module.exports = router;
