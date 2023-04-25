const { Courses, Users, UserSession } = model("");
const { HashPassword, compare, options, assignToken } = helper("UserHelpers");
const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList, GraphQLNonNull, graphql } = require('graphql');
const { graphqlHTTP } = require('express-graphql');
const { CourseType, UserType, SessionType, TeacherCourseType, EnrolledCourseType } = require('../GraphQl/Types');
const { Op } = require('sequelize');




// GET ALL COURSES //

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        courses: {
            type: new GraphQLList(CourseType),
            description: 'All Available Courses',
            args: {
                id: { type: GraphQLInt }
            },
            resolve: async (parent, args, context) => {
                if (args.id) {
                    const courses = await Courses.findAll({ where: { id: args.id } });
                    return courses;
                } else {
                    const courses = await Courses.findAll();
                    return courses;
                }
            }
        }
    })
});




// USER LOGIN //

const LoginType = new GraphQLObjectType({
    name: 'Login',
    description: 'Login Query',
    fields: () => ({
        user: {
            type: UserType,
            args: {
                email: { type: new GraphQLNonNull(GraphQLString) },
                password: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: async (parent, args, context) => {
                if (context.cookies.Token) {
                    const session = await UserSession.findOne({ where: { token: context.cookies.Token } });
                    if (session) {
                        const user = await Users.findOne({ where: { id: session.user_id } });
                        return { message: { status: 'success', message: 'user login successfully' } };
                    }
                }
                const user = await Users.findOne({ where: { email: args.email } });
                if (!user) {
                    return { message: { status: 'failed', message: 'Invalid email' } };
                };
                await compare(args.password, user.password);
                const token = await assignToken(user.id)
                // Set the cookie in the response
                context.res.cookie('Token', token, options);
                await UserSession.create({
                    user_id: user.id,
                    token: token
                });

                return { message: { status: 'success', message: 'user login successfully' } };
            }
        }
    })
});




// USER SIGNUP //

const SignupType = new GraphQLObjectType({
    name: 'Signup',
    description: 'Signup Query',
    fields: () => ({
        signup: {
            type: UserType,
            args: {
                username: { type: new GraphQLNonNull(GraphQLString) },
                email: { type: new GraphQLNonNull(GraphQLString) },
                password: { type: new GraphQLNonNull(GraphQLString) },
                role: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: async (parent, args, context) => {
                const exist = await Users.findOne({ where: { email: args.email } });
                if (exist) {
                    return { message: { status: 'failed', message: 'email already exists' } };
                };
                const hash = await HashPassword(args.password);
                const user = await Users.create({
                    username: args.username,
                    email: args.email,
                    password: hash,
                    role: args.role
                });
                const token = await assignToken(user.id)
                // Set the cookie in the response
                context.res.cookie('Token', token, options);

                return { message: { status: 'success', message: 'user signup successfully' } };
            }
        }
    })
});




// USER LOGOUT //

const LogoutType = new GraphQLObjectType({
    name: 'Logout',
    description: 'Logout Query',
    fields: () => ({
        logout: {
            type: SessionType,
            description: 'user session',
            resolve: async (parent, args, context) => {
                if (context.cookies.Token) {
                    const session = await UserSession.findOne({ where: { token: context.cookies.Token } });
                    if (session) {
                        await session.destroy();
                        return { message: { status: 'success', message: 'user logout successfully' } };
                    } else {
                        return { message: { status: 'failed', message: 'please login first' } };
                    }
                }
            }
        }
    })
});




//  USER PASSWORD CHANGE //

const PasswordType = new GraphQLObjectType({
    name: 'Password',
    description: 'Password Change',
    fields: () => ({
        updateUser: {
            type: UserType,
            args: {
                currPassword: { type: new GraphQLNonNull(GraphQLString) },
                newPassword: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: async (parent, args, context) => {
                const user = await Users.findOne({ where: { id: context.user.id } });
                const check = await compare(args.currPassword, user.password);
                if (!check) {
                    return { message: { status: 'failed', message: 'incorrect password' } };
                }
                const hash = await HashPassword(args.newPassword);
                const newUser = await user.update({
                    password: hash
                });
                return { message: { status: 'success', message: 'password changed successfully' } };
            }
        }
    })
});




//  DEACTIVATE USER ACCOUNT //

const DeactiveType = new GraphQLObjectType({
    name: 'Deactive',
    description: 'Deactive Account',
    fields: () => ({
        deleteUser: {
            type: UserType,
            resolve: async (parent, args, context) => {
                console.log(context.user.id)
                const user = await Users.findOne({ where: { id: context.user.id } });
                await UserSession.destroy({ where: { [Op.and]: { token: context.cookies.Token, user_id: user.id } } });
                await user.destroy();
                return { message: { status: 'success', message: 'account deacvtivated successfully' } };
            }
        }
    })
});



// GET ALL TEACHERS COURSES //

const TeacherCourses = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        teachercourses: {
            type: new GraphQLList(TeacherCourseType),
            description: 'All Available Courses',
            args: {
                id: { type: GraphQLInt }
            },
            resolve: async (parent, args, context) => {
                if (args.id) {
                    const courses = await Courses.findAll({ where: { [Op.and]: { id: args.id, teacher_id: context.user.id } } });
                    return courses;
                } else {
                    const courses = await Courses.findAll({ where: { teacher_id: context.user.id } });
                    return courses;
                }
            }
        }
    })
});




// GET ALL ENROLLED COURSES //

const EnrollCourse = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        courses: {
            type: new GraphQLList(EnrolledCourseType),
            description: 'All Available Courses',
            args: {
                id: { type: GraphQLInt }
            },
            resolve: async (parent, args, context) => {
                if (args.id) {
                    const courses = await Courses.findOne({ where: { [Op.and]: { id: args.id, teacher_id: context.user.id } } });
                    return courses;
                } else {
                    const courses = await Courses.findAll({ where: { teacher_id: context.user.id } });
                    return courses;
                }
            }
        }
    })
});







module.exports = {
    RootQueryType,
    LoginType,
    SignupType,
    LogoutType,
    PasswordType,
    DeactiveType,
    TeacherCourses,
    EnrollCourse
}