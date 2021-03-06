// // @flow


// const express = require('express');
// const PORT = process.env.PORT || 3002
// const app = express().listen(PORT, () => console.log('ssssss', PORT));
// app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({
//     extended: false
// }));

// const server = http.createServer(app);
// const io = require('socket.io')(server);

// const HookProcessor = require('./hookProcessor');
// const LoadTester = require('./loadTester');

// const process = new HookProcessor('116529085375415_566172007077785', io);
// const loadTester = new LoadTester(io);


// app.get('/', (req, res) => {
//     res.send("Home page. Server running okay.");
// });

// // For load testing
// app.get('/load/:num', async(req, res) => {
//     const numberOfUser = parseInt(req.params.num, 10) || 1000;
//     await loadTester.runLoadTest(numberOfUser);
//     res.status(200).send("OK");
// });

// app.get('/webhook', function(req, res) {
//     if (req.query['hub.verify_token'] === 'anh_hoang_dep_trai_vo_doi') {
//         res.send(req.query['hub.challenge']);
//         return;
//     }
//     res.send('Error, wrong validation token');
// });

// app.post('/webhook', async(req, res) => {
//     const hookObject = req.body;
//     console.log(JSON.stringify(hookObject, null, 2));
//     await process.processHook(hookObject);

//     res.status(200).send("OK");
// });

// app.post('/notification', async(req, res) => {
//     const hookObject = req.body;
//     console.log(JSON.stringify(hookObject, null, 2));

//     res.status(200).send("OK");
// });

// const PORT = process.env.PORT || 3002
// app.listen(PORT, function() {
//     console.log('Node app is running on port', PORT);
//   });

// app.listen(process.env.PORT || 3000, function(){
//     console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
//   });
const http = require('http');
const logger = require('morgan');
const bodyParser = require('body-parser');
const express = require('express')
const path = require('path')

const HookProcessor = require('./hookProcessor');
const LoadTester = require('./loadTester');



const PORT = process.env.PORT || 5000
const app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
const server = http.createServer(app);
const io = require('socket.io')(server);
const hookProcessor = new HookProcessor('116529085375415_566172007077785', io);
const loadTester = new LoadTester(io);
// app
//   .listen(PORT, () => console.log(`Listening on ${ PORT }`));
app.get('/', (req, res) => {
    res.send("Home page. Server running okay. 2222");
});
app.get('/webhook', function(req, res) {
    if (req.query['hub.verify_token'] === 'anh_hoang_dep_trai_vo_doi') {
        res.send(req.query['hub.challenge']);
        return;
    }
    res.send('Error, wrong validation token');
});

app.post('/webhook', async(req, res) => {
    const hookObject = req.body;
    console.log(JSON.stringify(hookObject, null, 2));
    await hookProcessor.processHook(hookObject);

    res.status(200).send("OK");
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))