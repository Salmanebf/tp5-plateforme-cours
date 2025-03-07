const express = require('express');
const Student = require('../models/StudentModel');
const axios = require("axios");
const router = express.Router();

router.get('/all', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/add', async (req, res) => {
    try {
        const student = new Student(req.body);
        await student.save();
        res.status(201).json(student);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/enroll/:etudiant_id/:cours_id", async (req, res)=>{
    try{
        const fetchCourses = await axios.get(`http://localhost:3001/cours/search/${req.params.cours_id}`,{
            headers: { 
                'Authorization': req.headers['authorization'] 
            }
        });
        const cours = fetchCourses.data;
        if (!cours){
            return res.json({message: "Cours not found"}) 
        }
        const student = await Student.find({id: req.params.etudiant_id})
        if (!student){
            return res.json({message: "student not found"}) 
        }
        const CheckStudentCourse = await Student.find({cours : {$in: [cours.id]}});
        if (CheckStudentCourse[0]){
            return res.json({message: "course Already exist "}) 
        }
        const updateStudent = await Student.updateOne({ id: req.params.etudiant_id }, { $push: { cours: req.params.cours_id } });
   
        res.json(updateStudent) 
    }
    catch (error) {
        res.status(500).json({error: error.message});
    }
})

router.get("/enrolledCourses/:etudiant_id",  async (req, res) => {
    try {
        const student = await Student.findOne({ _id: req.params.etudiant_id });
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        const enrolledCourseIds = student.cours;
        const fetchCourses = await axios.get('http://localhost:3001/cours/all',{
            headers: { 
                'Authorization': req.headers['authorization'] 
            }
        });
        const allCourses = fetchCourses.data;
        const existingCourseIds = allCourses.map(course => course.id);
        const deletedCourses = enrolledCourseIds.filter(id => !existingCourseIds.includes(id));
        if(deletedCourses){
            await Student.updateOne({ id: req.params.etudiant_id }, { $pull: { cours: { $in: deletedCourses } } });
        } 
        const studentCourses = allCourses.filter(course => enrolledCourseIds.includes(course.id));
        res.status(200).json(studentCourses);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});




module.exports = router;
