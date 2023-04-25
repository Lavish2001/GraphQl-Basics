const { GraphQLSchema } = require('graphql');
const { RootQueryType, LoginType, SignupType, LogoutType, PasswordType, DeactiveType, TeacherCourses, EnrollCourse } = require('../GraphQl/Queries');



// COURSE SCHEMA //

const courseSchema = new GraphQLSchema({
    query: RootQueryType
});



// LOGIN SCHEMA //

const loginSchema = new GraphQLSchema({
    query: LoginType
});



// SIGNUP SCHEMA //

const signupSchema = new GraphQLSchema({
    query: SignupType
});



// LOGOUT SCHEMA //

const logoutSchema = new GraphQLSchema({
    query: LogoutType
});



// CHANGE PASSWORD SCHEMA //

const password = new GraphQLSchema({
    query: PasswordType
});



// DEACTIVATE ACCOUNT SCHEMA //

const deactivate = new GraphQLSchema({
    query: DeactiveType
});



// TEACHERS ALL COURSES SCHEMA //

const teacherCourse = new GraphQLSchema({
    query: TeacherCourses
});



// STUDENTS ENROLL COURSES SCHEMA //

const studentEnroll = new GraphQLSchema({
    query: EnrollCourse
});




module.exports = {
    courseSchema,
    loginSchema,
    signupSchema,
    logoutSchema,
    password,
    deactivate,
    teacherCourse,
    studentEnroll
}
