const { Users, Enrollments, Grades, Lessons } = model("");
const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList, GraphQLNonNull } = require('graphql');




// SESSION TYPE //

const SessionType = new GraphQLObjectType({
    name: 'UserSession',
    description: 'sessions',
    fields: () => ({
        user_id: { type: new GraphQLNonNull(GraphQLInt) },
        token: { type: new GraphQLNonNull(GraphQLString) },
        message: { type: MessageType }
        // add other fields as needed
    }),
});



// USER TYPE //

const UserType = new GraphQLObjectType({
    name: 'Users',
    description: 'all Courses',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLInt) },
        username: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        role: { type: new GraphQLNonNull(GraphQLString) },
        currPassword: { type: new GraphQLNonNull(GraphQLString) },
        newPassword: { type: new GraphQLNonNull(GraphQLString) },
        message: { type: MessageType }
        // add other fields as needed
    }),
});



// GRADE TYPE //

const GradeType = new GraphQLObjectType({
    name: 'Grades',
    description: 'Student Grades',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLInt) },
        grade: { type: GraphQLString },
        // add other fields as needed
    }),
});



// ENROLLMENT TYPE //

const EnrollmentType = new GraphQLObjectType({
    name: 'Enrollments',
    description: 'Students Enrollments',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLInt) },
        student_id: { type: new GraphQLNonNull(GraphQLInt) },
        course_id: { type: new GraphQLNonNull(GraphQLInt) },
        enrolled_at: { type: new GraphQLNonNull(GraphQLString) },
        completed_at: { type: GraphQLString },
        student_details: {
            type: UserType,
            resolve: async (parent, args) => {
                return Users.findOne({ where: { id: parent.student_id } })
            }
        },
        student_grade: {
            type: GradeType,
            resolve: async (parent, args) => {
                return Grades.findOne({ where: { student_id: parent.student_id, course_id: parent.course_id } })
            }
        },
        // add other fields as needed
    }),
});



// STUDENT ENROLLMENT TYPE //

const StudentEnrollmentType = new GraphQLObjectType({
    name: 'StudentEnrollments',
    description: 'Students Enrollments',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLInt) },
        student_id: { type: new GraphQLNonNull(GraphQLInt) },
        enrolled_at: { type: new GraphQLNonNull(GraphQLString) },
        completed_at: { type: GraphQLString },
        student_details: {
            type: UserType,
            resolve: async (parent, args) => {
                return Users.findOne({ where: { id: parent.student_id } })
            }
        }
        // add other fields as needed
    }),
});



// COURSE TYPE //

const CourseType = new GraphQLObjectType({
    name: 'Courses',
    description: 'all Courses',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLInt) },
        course_name: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
        course_price: { type: new GraphQLNonNull(GraphQLInt) },
        teacher: {
            type: UserType,
            resolve: async (parent, args) => {
                return Users.findOne({ where: { id: parent.teacher_id } })
            }
        },
        enrollments: {
            type: new GraphQLList(EnrollmentType),
            resolve: async (parent, args, context) => {
                if (context.user.role === 'Teacher') {
                    return Enrollments.findAll({ where: { course_id: parent.id } });
                }
            }
        }
        // add other fields as needed
    }),
});



// TEACHER COURSE TYPE //

const TeacherCourseType = new GraphQLObjectType({
    name: 'TeacherCourses',
    description: 'Teacher Courses',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLInt) },
        course_name: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
        course_price: { type: new GraphQLNonNull(GraphQLInt) },
        teacher_id: { type: new GraphQLNonNull(GraphQLInt) },
        lessons: {
            type: new GraphQLList(LessonType),
            resolve: async (parent, args, context) => {
                return Lessons.findAll({ where: { course_id: parent.id }, order: [['order', 'ASC']] })
            },
        }
        // add other fields as needed
    }),
});



// LESSON TYPE //

const LessonType = new GraphQLObjectType({
    name: 'CourseLesson',
    description: 'Course Lessons',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLInt) },
        description: { type: new GraphQLNonNull(GraphQLString) },
        video: { type: GraphQLString },
        documentation: { type: GraphQLString },
        order: { type: new GraphQLNonNull(GraphQLInt) }
        // add other fields as needed
    }),
});



// MESSAGE TYPE //

const MessageType = new GraphQLObjectType({
    name: 'Message',
    description: 'A success/failure message',
    fields: () => ({
        status: { type: GraphQLString },
        message: { type: GraphQLString }
    })
});



// STUDENT ENROLLED COURSE TYPE //

const EnrolledCourseType = new GraphQLObjectType({
    name: 'EnrolledCourses',
    description: 'Teacher Courses',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLInt) },
        course_name: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
        course_price: { type: new GraphQLNonNull(GraphQLInt) },
        teacher_id: { type: new GraphQLNonNull(GraphQLInt) },
        enrollments: {
            type: new GraphQLList(StudentEnrollmentType),
            resolve: async (parent, args, context) => {
                return Enrollments.findAll({ where: { course_id: parent.id } })
            },
        }
        // add other fields as needed
    }),
});



module.exports = {
    CourseType,
    UserType,
    SessionType,
    MessageType,
    TeacherCourseType,
    LessonType,
    EnrolledCourseType
}