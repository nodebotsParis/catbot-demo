var catbot = require('catbot');
catbot(function (error, hardware) {
    hardware.online.on();
    var static = require('node-static');
    var file = new static.Server('./public');
    var server = require('http').createServer(function (request, response) {
        request.addListener('end', function () {
            file.serve(request, response);
        }).resume();
    });
    var io = require('socket.io')(server);
    server.listen(8080);
    console.log("open the url http://localhost:8080");
    io.on('connection',function (socket) {
      socket.on('xy', function (data) {
        hardware.x.to(data.x);
        hardware.y.to(data.y);
      });
      socket.on('on', function () {
        hardware.laser.on();
      });
      socket.on('off', function () {
        hardware.laser.off();
      });
    });
});



