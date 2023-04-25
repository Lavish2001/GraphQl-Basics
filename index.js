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






// MULTITHREADING FOR NODE.JS //

// const { Worker } = require('worker_threads');

// // create a new worker thread
// const worker = new Worker('./new.js');

// // send a message to the worker thread
// worker.postMessage('Some data to process');

// // listen for messages from the worker thread
// worker.on('message', (result) => {
//   console.log(`Received result from worker thread: ${result}`);
// });




// NODE.JS STREAMS //

// const fs = require('fs');
// const { Transform } = require('stream');

// // Create a readable stream that reads data from a file
// const readable = fs.createReadStream('destination.txt', { encoding: 'utf8' });

// // Create a transform stream that modifies the data
// const transformer = new Transform({
//   transform(chunk, encoding, callback) {
//     // Convert the data to uppercase and append an exclamation mark
//     const modifiedChunk = chunk.toString().toUpperCase() + '!';

//     // Pass the modified data to the next stream
//     callback(null, modifiedChunk);
//   }
// });

// // Create a writable stream that writes data to a file
// const writable = fs.createWriteStream('output.txt', { encoding: 'utf8' });

// // Pipe the streams together to read, modify, and write the data
// readable.pipe(transformer).pipe(writable);

// // Handle the 'finish' event to know when the entire stream has been processed
// writable.on('finish', () => {
//   console.log('Finished processing the file.');
// });

// // Handle the 'error' event to handle any errors that occur while processing the file
// writable.on('error', (err) => {
//   console.error(`Error processing the file: ${err}`);
// });






// GET SYSTEM IP ADDRESS //

// const os = require('os');
// console.log(os.cpus().length)

// const networkInterfaces = os.networkInterfaces();

// // Iterate over the network interfaces to find the IPv4 address
// Object.keys(networkInterfaces).forEach((interfaceName) => {
//   const networkInterface = networkInterfaces[interfaceName];
//   networkInterface.forEach((address) => {
//     // Check that the address is an IPv4 address and is not the loopback address
//     if (address.family === 'IPv4' && !address.internal) {
//       console.log(`System IP address: ${address.address}`);
//     }
//   });
// });


