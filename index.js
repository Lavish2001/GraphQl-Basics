// index.js
require("./bin/kernel");
let serverless = require("serverless-http");
let express = require("express");
let path = require("path");
const { sequelize } = require('./app/Models/index');
let logger = require("morgan");
let cookieParser = require("cookie-parser");
let courseRoutes = require("./routes/CourseApi");
let userRoutes = require("./routes/UserApi");
let lessonRoutes = require("./routes/LessonsApi");
let enrollmentRoutes = require("./routes/EnrollementApi");
let testRoutes = require("./routes/TestApi");
let questionRoutes = require("./routes/QuestionApi");
let marksRoutes = require("./routes/MarksApi");
let gradeRoutes = require("./routes/GradesApi");
let optionsRoutes = require('./routes/OptionsApi');

// Import the library:
let cors = require("cors");
let app = express();
const dir = (__dirname + '/Public/Courses/Lessons');

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));




// FILES ROUTES //



app.use('/Images', express.static(path.join(dir)));

app.use(cors());
// app.use("/www", webRoutes);
app.use("/", userRoutes);
app.use("/api/v1", courseRoutes);
app.use("/api/v2", lessonRoutes);
app.use("/api/v3", enrollmentRoutes);
app.use("/api/v4", testRoutes);
app.use("/api/v5", questionRoutes);
app.use("/api/v6", marksRoutes);
app.use("/api/v7", gradeRoutes);
app.use("/api/v8", optionsRoutes);
// app.use("/api/v9", paymentRoutes);


// catch 404 and forward to error handler
app.use((req, res, next) => {
  console.log(next)
  next({
    status: 404,
    message: "Not Found",
  });
});

// error handler
app.use((err, req, res, next) => {
  if (err.status === 404) {
    return res.status(404).render("errors/404");
  }

  if (err.status === 500) {
    return res.status(500).render("errors/500");
  }
  return next();
});


module.exports = app;
module.exports.handler = serverless(app);