// const { parentPort } = require('worker_threads');

// parentPort.on('message', (data) => {
//     const result = longRunningOperation(data);
//     parentPort.postMessage(result);
// });

// function longRunningOperation(data) {
//     // simulate a long-running operation
//     const start = Date.now();
//     while (Date.now() - start < 10000) { }

//     // return the result
//     return `Processed data: ${data}`;
// };
