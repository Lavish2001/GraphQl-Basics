const express = require("express");
const router = express.Router();
const ccontroller = controller("Api/CourseController");
const loginAuth = middleware("loginAuth");
const { graphqlHTTP } = require('express-graphql');
const { courseSchema, teacherCourse, studentEnroll } = require('../app/GraphQl/Schema');



// CREATE COURSE //

router.post('/course/create', loginAuth, (req, res) => {
    return ccontroller.createCourse(req, res);
});




// UPDATE COURSE //

router.patch('/course/update', loginAuth, (req, res) => {
    return ccontroller.updateCourse(req, res);
});




// DELETE COURSE //

router.delete('/course/delete', loginAuth, (req, res) => {
    return ccontroller.deleteCourse(req, res);
});



// TEACHER COURSES //

router.get('/course/teachercourses', loginAuth, graphqlHTTP({
    schema: teacherCourse,
    graphiql: true,
    rootValue: true
})
);



// ALL COURSES //

router.get('/course/all', loginAuth, graphqlHTTP({
    schema: courseSchema,
    graphiql: true,
    rootValue: true
})
);



// COURSE ENROLL BY STUDENTS //

router.get('/enroll-course-students', loginAuth, graphqlHTTP({
    schema: studentEnroll,
    graphiql: true,
    rootValue: true
})
);




module.exports = router;
