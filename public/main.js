function map (value, fromLow, fromHigh, toLow, toHigh) {
        return (value - fromLow) * (toHigh - toLow) / (fromHigh - fromLow) + toLow;
    }

    function limit(value, min, max) {
        return Math.max(min, Math.min(value, max));
    }

    var socket = io("http://localhost:8080");
    var $pointer = $(window.pointer);
    socket.on('news', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
    });
    var X_MIN = 175;
    var X_MAX = 15;
    var Y_MIN = 140;
    var Y_MAX = 15;

    var xPos = window.innerWidth / 2;
    var yPos = window.innerHeight / 2;

    goToEvent({ pageX: xPos, pageY: yPos });

    function goToEvent(event) {
        console.log('fired');
        var pX = parseInt(limit(event.pageX, 0, window.innerWidth), 10);
        var pY = parseInt(limit(event.pageY, 0, window.innerHeight), 10);
        xPos = pX;
        yPos = pY;
        var x = ~~map(pX, 0, window.innerWidth, X_MIN, X_MAX);
        var y = ~~map(pY, 0, window.innerHeight, Y_MIN, Y_MAX);

        socket.emit("xy", {
            x: x,
            y: y
        });
    }

    function pointerToEvent(event) {
        var pX = parseInt(limit(event.pageX, 0, window.innerWidth), 10);
        var pY = parseInt(limit(event.pageY, 0, window.innerHeight), 10);
        var x = ~~map(pX, 0, window.innerWidth, X_MIN, X_MAX);
        var y = ~~map(pY, 0, window.innerHeight, Y_MIN, Y_MAX);
        $pointer.css({
            left: pX,
            top: pY
        }).text(x + ',' + y);
    }

    function fire() {
        window.pow.play();
        socket.emit('on');
        setTimeout(function () {
          socket.emit('off');
        }, 300);
    }

    var debouncedFire = _.throttle(fire, 1000, true);

    var down = false;
    var keydown = false;

    $(document).on('mousedown', function () {
        down = true;
    });

    $(document).on('mouseup', function () {
        down = false;
    });

    $(document).on('mousemove', function (event) {
        pointerToEvent(event);
        if (!down) return;
        goToEvent(event);
    });

    $(document).on('click', function (event) {
        goToEvent(event);
    });

    $(document).on('keydown', function (event) {
        if (key.isPressed('space') && !keydown) {
            console.log('fire');
            keydown = true;
            debouncedFire();
        }

        if (key.isPressed('up')) goToEvent({ pageX: xPos, pageY: yPos - 20 });
        if (key.isPressed('down')) goToEvent({ pageX: xPos, pageY: yPos + 20 });
        if (key.isPressed('left')) goToEvent({ pageX: xPos - 20, pageY: yPos });
        if (key.isPressed('right')) goToEvent({ pageX: xPos + 20, pageY: yPos });
    });

    $(document).on('keyup', function (event) {
        if (event.which == 32) {
            keydown = false;
        }
    });
    $('.laserStatus').click(function () {
        var that = $('.laserStatus');
        if(that.hasClass('on') === false){
            socket.emit('on');
            that.toggleClass('on');
        }
        else{
            socket.emit('off');
            that.toggleClass('on');
        }
        // body...
    });