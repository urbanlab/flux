const express = require('express');
const app = express();

app.get('/', function(req, res) {
    res.send("Hello World!");
});

app.get('/mobile', function(req, res) {
    res.sendfile('views/mobile/index.html');
});

app.get('/visu', function(req, res) {
   res.sendfile('views/visu/index.html');
});

app.listen(3000, function() {
    console.log('FLUX Server started on port 3000');
});
