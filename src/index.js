// @flow

const http = require('http');
const logger = require('morgan');
const bodyParser = require('body-parser');
const express = require('express');

const app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

const server = http.createServer(app);
const io = require('socket.io')(server);

const HookProcessor = require('./hookProcessor');
const LoadTester = require('./loadTester');

const process = new HookProcessor('116529085375415_566172007077785', io);
const loadTester = new LoadTester(io);

app.set('port', (process.env.PORT || 5000));

app.get('/', (req, res) => {
    res.send("Home page. Server running okay.");
});

// For load testing
app.get('/load/:num', async(req, res) => {
    const numberOfUser = parseInt(req.params.num, 10) || 1000;
    await loadTester.runLoadTest(numberOfUser);
    res.status(200).send("OK");
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
    await process.processHook(hookObject);

    res.status(200).send("OK");
});

app.post('/notification', async(req, res) => {
    const hookObject = req.body;
    console.log(JSON.stringify(hookObject, null, 2));

    res.status(200).send("OK");
});


app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
  });

// app.listen(process.env.PORT || 3000, function(){
//     console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
//   });